const inputSelector = 'input';
const patternsSelector = 'patterns';
const textType = /text.*/;

const intersection = (a, b) => a.filter(c => b.includes(c));
const partial = (a, b) => a.filter(c => b.some(d => c.includes(d)));
const similar = (a, b) => a.filter(c => b.some(d => levenstein(c, d) <= 1));
const modeList = [intersection, partial, similar];

const element = (id) => document.getElementById(id);
const template = element('template').innerHTML;
const target = element('target');

const getFile = (form, field) => form[field].files[0];
const validateFile = (file) => file && file.type.match(textType);
const formatData = (data) => data.map(
    ({title, value}) => ({
        modeName: title,
        modeValue: value
    })
);

const readFile = file =>
    new Promise((resolve, reject) => {
        if (!validateFile(file)) {
            return reject('invalid input');
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = (loadEvent) =>
            resolve(loadEvent.target.result);
    }).catch(error => {
        return error;
    });

const render = (result, error) => {
    Mustache.parse(template);
    const rendered = Mustache.render(template, {
        data: {
            modes: result,
            message: error
        }
    });
    target.innerHTML = rendered;
};

const invokeFunction = (func, ...args) => ({
    title: func.name,
    value: func(...args)
});

const parse = str => str.split('\n')
                        .map(s => s.trim())
                        .filter(s => !!s);

const getForm = (formId) => {
    [inputPromise, patternsPromise] = [inputSelector, patternsSelector].map(selector =>
        readFile(getFile(element(formId), selector)));

    return Promise.all([inputPromise, patternsPromise])
        .then((data) => {
            [input, patterns] = data.map(element => parse(element));
            const result = modeList.map(mode => invokeFunction(mode, input, patterns));
            const formatResult = formatData(result);
            render(formatResult);
        })
        .catch(error => {
            render([], error);
        })
};