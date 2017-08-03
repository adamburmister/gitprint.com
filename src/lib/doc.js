// @flow
// import renderer from './renderer';
import marked from './marked';
import styles from '../pdf-stylesheet/default';
import GitPrintLexer from './lexer';

marked.setOptions({
  // renderer: new GitPrintRenderer,
  lexer: new GitPrintLexer(),
  // gfm: true,
  // tables: true,
  breaks: true,
  // pedantic: false,
  // sanitize: false,
  // sanitizer: null,
  // mangle: true,
  // smartLists: false,
  // silent: false,
  // highlight: null,
  // langPrefix: 'lang-',
  smartypants: true,
  // headerPrefix: '',
  // xhtml: false
});

/**
 * Marshall marked lexer tokens to the PDFMake document content AST
 * @see http://pdfmake.org/#/gettingstarted
 */
export default (md) => {
  // const content = '[' + marked(md).replace(/,$/, '') + ']';
  const tokens = GitPrintLexer.lex(md);
  const content = marked.parser(tokens);
  console.log(tokens);
  console.log(content);
  // const content = JSON.parse(docJSON);

  return { 
    content,
    styles,
  };
}