export default {
  '*.{js,jsx,ts,tsx,cjs}': ['prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['prettier --write'],
  '*.{scss,less,styl,html}': ['prettier --write'],
  '*.md': ['prettier --write']
}
