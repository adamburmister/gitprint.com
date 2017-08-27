import fs from 'fs';
import marked from '../lib/marked';

// Helpers to load the test fixtures
const fixture = (filename, format = 'text') => 
  fs.readFileSync(`src/tests/fixtures/${filename}.${format}`)
    .toString();

const markdownDoc = (filename) => fixture(filename, 'text');
const pdfmakeStruct = (filename) => JSON.parse(fixture(filename, 'json'));

const itShouldRender = (filename) => 
  it(`should render the ${filename} fixture`, () => {
    expect(
      marked(markdownDoc(filename))
    ).toEqual(
      pdfmakeStruct(filename)
      );
  });

describe('marked to pdfmake rendering', () => {

  /*FAILING*/ itShouldRender('autolink_lines');
  /*FAILING*/ itShouldRender('blockquote_list_item');
  itShouldRender('bold_and_italic_text');
  itShouldRender('case_insensitive_refs');
  /*FAILING*/ itShouldRender('def_blocks');
  /*FAILING*/ itShouldRender('double_link');
  itShouldRender('escaped_angles');
  itShouldRender('header');
  itShouldRender('hr_list_break');
  /*FAILING*/ itShouldRender('image');
  itShouldRender('lazy_blockquotes');
  itShouldRender('link');
  /*FAILING*/ itShouldRender('list_item_text');
  /*FAILING*/ itShouldRender('loose_lists');
  /*FAILING*/ itShouldRender('main');
  itShouldRender('nested_code');
  itShouldRender('nested_em');
  /*FAILING*/ itShouldRender('nested_square_link');
  /*FAILING*/ itShouldRender('not_a_link');
  itShouldRender('ref_paren');
  itShouldRender('same_bullet');
  itShouldRender('simple_paragraph');
  /*FAILING*/ itShouldRender('table');
  itShouldRender('text.smartypants');
  itShouldRender('tricky_list');

});
