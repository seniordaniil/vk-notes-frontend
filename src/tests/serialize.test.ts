import escapeHtml from 'escape-html';
import { Node, Text } from 'slate';
import { jsx } from 'slate-hyperscript';

const serialize = (node: Node): string => {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }

  const children = node.children.map((n) => serialize(n)).join('');

  switch (node.type) {
    case 'img':
      return `<img src="${escapeHtml(node.url as string)}" />`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'title':
      return `<h2>${children}</h2>`;
    case 'check-list-item':
      return `<input type="checkbox" ${
        node.checked ? 'checked' : ''
      } value="${children}" />`;
    default:
      return children;
  }
};

const deserialize = (el: Element): any => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  const childNodes = Array.from((el.childNodes as unknown) as Element[]);
  const children = childNodes.map(deserialize);
  if (children.length < 1) children.push({ text: '' });

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children);
    case 'P':
      return jsx('element', { type: 'paragraph' }, children);
    case 'H2':
      return jsx('element', { type: 'title' }, children);
    case 'IMG':
      return jsx(
        'element',
        { type: 'img', url: el.getAttribute('src') },
        children,
      );
    case 'INPUT': {
      if (el.getAttribute('type') === 'checkbox') {
        const checked = el.getAttribute('checked') !== null ? true : false;
        console.log('checked', el.getAttribute('checked'));
        return jsx('element', { type: 'check-list-item', checked }, [
          [jsx('text', el.getAttribute('value'))],
        ]);
      }
    }
    default:
      return children;
  }
};

test('serialize', () => {
  const data = `[{\"type\":\"paragraph\",\"children\":[{\"text\":\"gg\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"ghhhhfffhhbff.     Gghbb gghhh.   Ghhhgfgg.    GhhhgggGhhhgggGhhhgggGhhhggg\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"check-list-item\",\"checked\":true,\"children\":[{\"text\":\"ghhhhj bnnnnb.        Bhhh\"}]},{\"type\":\"check-list-item\",\"checked\":false,\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]},{\"type\":\"img\",\"url\":\"https://sun9-74.userapi.com/TcktGjQVKqrabWxvasPAUQ3-w0h83k31jvCAZw/MUTTZQwdqUU.jpg\",\"children\":[{\"text\":\"\"}]},{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]`;
  const text = JSON.parse(data);
  const serialized = text.map(serialize).join('');
  console.log('serialized', serialized);

  const document = new DOMParser().parseFromString(serialized, 'text/html');
  const res = JSON.stringify(deserialize(document.body));
  console.log(res);
  expect(res).toBe(data);
});
