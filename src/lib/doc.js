// @flow
import marked from './marked';
import styles from '../pdf-stylesheet/default';

marked.setOptions({
  // gfm: true,
  tables: true,
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

export default (md) => {
  const content = marked(md);
  const doc = {
    content,
    styles,
  }
  console.log(doc);
  return doc;
}