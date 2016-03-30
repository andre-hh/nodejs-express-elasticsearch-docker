var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'elasticsearch:9200',
    log: 'info'
});

var indexName = 'books';

function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: 'book',
        body: {
            properties: {
                title: { type: 'string' },
                suggest: {
                    type: 'completion',
                    analyzer: 'simple',
                    search_analyzer: 'simple',
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addBook(book) {
    return elasticClient.index({
        index: indexName,
        type: 'book',
        body: {
            title: book.title,
            suggest: {
                input: book.title.split(' '),
                output: book.title,
                payload: book.metadata || {}
            }
        }
    });
}
exports.addBook = addBook;

function getSuggestions(input) {
    return elasticClient.suggest({
        index: indexName,
        type: 'book',
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: 'suggest',
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;
