/**
 * @fileoverview Transform lodash map to native JS map function.
 * @author Yuri Mikhin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const LODASH_IDENTIFIER_NAME = '_';
const MAP_FUNCTION_IDENTIFIER_NAME = 'map';

const IS_ARRAY_PROPERTY_NAME = 'isArray';
const IS_INSTANCE_OF_ARRAY_OPERATOR_NAME = 'instanceof';
const IS_INSTANCE_OF_ARRAY_ENTITY_NAME = 'Array';
const OBJECT_LITERAL_TYPE_NAME = 'ObjectExpression';
const ARRAY_LITERAL_TYPE_NAME = 'ArrayExpression';
const NODE_IS_ARRAY_CHECK_TYPES = ['ConditionalExpression', 'IfStatement'];

const IDENTIFIER_COLLECTION_REPORT_MESSAGE = 'Need to add checking is argument Array or Object.';
const ARRAY_LITERAL_COLLECTION_REPORT_MESSAGE = 'Need to be transformed into native JS Array.map function.';

module.exports = {
  meta: {
    docs: {
      description: 'Transform lodash map to native JS map function.',
      recommended: true,
    },
    fixable: 'code',
  },

  create(context) {
    function isNodeIsArrayCheck(node, mapFirstArgumentName) {
      return node.test.arguments
        && node.test.arguments[0].name === mapFirstArgumentName
        && node.test.callee.property.name === IS_ARRAY_PROPERTY_NAME;
    }

    function isNodeIsInstanceOfArrayCheck(node) {
      return node.test.operator === IS_INSTANCE_OF_ARRAY_OPERATOR_NAME
        && node.test.right.name === IS_INSTANCE_OF_ARRAY_ENTITY_NAME;
    }

    function isExistArrayCheckOutsideOfNode(nodeParent, nodeFirstArgumentName) {
      return (NODE_IS_ARRAY_CHECK_TYPES.includes(nodeParent.type))
        && (isNodeIsArrayCheck(nodeParent, nodeFirstArgumentName)
          || isNodeIsInstanceOfArrayCheck(nodeParent));
    }

    function getTernaryFix(node) {
      const [collection, callback] = node.arguments;
      const collectionSourceText = context.getSourceCode().getText(collection);

      if (callback) {
        const callbackSourceText = context.getSourceCode().getText(callback);
        return `Array.isArray(${collectionSourceText}) ? ${collectionSourceText}.map(${callbackSourceText}) : _.map(${collectionSourceText}, ${callbackSourceText})`;
      }

      return `Array.isArray(${collectionSourceText}) ? ${collectionSourceText}.map() : _.map(${collectionSourceText})`;
    }

    function getNativeArrayFix(node) {
      const [collection, callback] = node.arguments;
      const collectionSourceText = context.getSourceCode().getText(collection);

      if (callback) {
        const callbackSourceText = context.getSourceCode().getText(callback);
        return `${collectionSourceText}.map(${callbackSourceText})`;
      }

      return `${collectionSourceText}.map()`;
    }

    function getIdentifierCollectionReport(node) {
      return {
        node,
        message: IDENTIFIER_COLLECTION_REPORT_MESSAGE,
        fix(fixer) {
          return fixer.replaceText(node, getTernaryFix(node));
        },
      };
    }

    function getArrayLiteralCollectionReport(node) {
      return {
        node,
        message: ARRAY_LITERAL_COLLECTION_REPORT_MESSAGE,
        fix(fixer) {
          return fixer.replaceText(node, getNativeArrayFix(node));
        },
      };
    }

    return {
      CallExpression: (node) => {
        const isLodashMapCall = node.callee.object
          && node.callee.object.name === LODASH_IDENTIFIER_NAME
          && node.callee.property.name === MAP_FUNCTION_IDENTIFIER_NAME;

        if (isLodashMapCall) {
          const argumentsLength = node.arguments.length;
          const collection = node.arguments[0];

          if (argumentsLength !== 0 && collection.type !== OBJECT_LITERAL_TYPE_NAME) {
            if (collection.type === ARRAY_LITERAL_TYPE_NAME) {
              return context.report(getArrayLiteralCollectionReport(node));
            }

            const collectionName = collection.name;
            const mapParents = context.getAncestors(node);

            const isExistArrayCheck = mapParents.some(
              (parrent) => !!(isExistArrayCheckOutsideOfNode(parrent, collectionName)),
            );

            if (!isExistArrayCheck) {
              return context.report(getIdentifierCollectionReport(node));
            }

            return undefined;
          }
        }

        return undefined;
      },
    };
  },
};
