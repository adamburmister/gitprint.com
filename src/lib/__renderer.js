// // @flow

// /**
//  * Render Markdown to an PDFMake DocumentDefinition AST
//  */
// import Marked from 'marked';
// const renderer = new Marked.Renderer();

// const asJSON = (obj) => JSON.stringify(obj) + ',';

// renderer.heading = (text, level) => asJSON({ text, style: `h${level}` });

// renderer.code = (code, lang, escaped) => {
//   return asJSON({ text: 'TODO ', style: 'TODO' });
//   // if (this.options.highlight) {
//   //   var out = this.options.highlight(code, lang);
//   //   if (out != null && out !== code) {
//   //     escaped = true;
//   //     code = out;
//   //   }
//   // }

//   // if (!lang) {
//   //   return '<pre><code>'
//   //     + (escaped ? code : escape(code, true))
//   //     + '\n</code></pre>';
//   // }

//   // return '<pre><code class="'
//   //   + this.options.langPrefix
//   //   + escape(lang, true)
//   //   + '">'
//   //   + (escaped ? code : escape(code, true))
//   //   + '\n</code></pre>\n';
// };

// renderer.blockquote = (quote) => asJSON({ text: quote, style: 'blockquote' });

// renderer.html = (html) => asJSON({ text: html, style: 'html' });

// renderer.hr = () => {
//   // return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.list = (body, ordered) => {
//   // var type = ordered ? 'ol' : 'ul';
//   // return '<' + type + '>\n' + body + '</' + type + '>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.listitem = (text) => {
//   // return '<li>' + text + '</li>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.paragraph = (text) => asJSON({ 
//   text, 
//   style: 'paragraph' 
// });

// renderer.table = (header, body) => {
//   // return '<table>\n'
//   //   + '<thead>\n'
//   //   + header
//   //   + '</thead>\n'
//   //   + '<tbody>\n'
//   //   + body
//   //   + '</tbody>\n'
//   //   + '</table>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.tablerow = (content) => {
//   // return '<tr>\n' + content + '</tr>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.tablecell = (content, flags) => {
//   // var type = flags.header ? 'th' : 'td';
//   // var tag = flags.align
//   //   ? '<' + type + ' style="text-align:' + flags.align + '">'
//   //   : '<' + type + '>';
//   // return tag + content + '</' + type + '>\n';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// // span level renderer
// renderer.strong = (text) => asJSON({ text, style: 'strong' });

// renderer.em = (text) => asJSON({ text, style: 'em' });

// renderer.codespan = (text) => asJSON({ text, style: 'codespan' });

// renderer.br = () => {
//   // return this.options.xhtml ? '<br/>' : '<br>';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.del = (text) => {
//   // return '<del>' + text + '</del>';
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.link = (href, title, text) => {
//   // if (this.options.sanitize) {
//   //   try {
//   //     var prot = decodeURIComponent(unescape(href))
//   //       .replace(/[^\w:]/g, '')
//   //       .toLowerCase();
//   //   } catch (e) {
//   //     return '';
//   //   }
//   //   if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
//   //     return '';
//   //   }
//   // }
//   // var out = '<a href="' + href + '"';
//   // if (title) {
//   //   out += ' title="' + title + '"';
//   // }
//   // out += '>' + text + '</a>';
//   // return out;
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.image = (href, title, text) => {
//   // var out = '<img src="' + href + '" alt="' + text + '"';
//   // if (title) {
//   //   out += ' title="' + title + '"';
//   // }
//   // out += this.options.xhtml ? '/>' : '>';
//   // return out;
//   return asJSON({ text: 'TODO ', style: 'TODO' });
// };

// renderer.text = (text) => text;
// // asJSON({ 
// //   text,
// //   style: 'text', 
// // });

// export default renderer;