const vars = {
  btn: [
    ['bold'],
    ['subscript'],
    ['superscript'],
    ['underline'],
    ['strikeThrough'],
    ['insertHorizontalRule'],
    ['insertOrderedList'],
    ['insertUnorderedList'],
    ['insertParagraph'],
    ['indent'],
    ['outdent'],
    ['selectAll'],
    ['removeFormat'],
    [
      'styleWithCSS', false, true
    ],
    ['enableObjectResizing']
  ],
  input: [
    {
      pars: [
        'foreColor', false
      ],
      df: '#212121'
    }, {
      pars: [
        'backColor', false
      ],
      df: '#ffffff'
    }, {
      pars: [
        'createLink', false
      ],
      df: 'https://marvelsq.github.io/ExecCommand'
    }, {
      pars: [
        'insertImage', false
      ],
      df: ''
    }
  ],
  single: [
    {
      label: 'justify',
      pars: [],
      values: ['justifyCenter', 'justifyLeft', 'justifyRight', 'justifyFull']
    }, {
      label: 'fontSize',
      pars: [
        'fontSize', false
      ],
      values: [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  ]
};
let btns = document.getElementById('command');
btns.innerHTML = vars.btn.reduce((f, n, i) => f + `<button data-op='${i}'>${n[0]}</button>`, '');
btns.addEventListener('click', function(e) {
  console.log(e.target);
  btnOp(e.target.dataset.op);
  edt.focus();
})
let inputs = document.getElementById('inputs');
inputs.innerHTML = vars.input.reduce((f, n, i) => f + `<label>${n.pars[0]}:</label><input onchange="inputOp(this,${i})" value="${n.df}">`, '');

let selects = document.getElementById('selects');
selects.innerHTML = vars.single.reduce((f, n, i) => f + `<label>${n.label}</label><select onchange="slOp(this,${i})" data-sg="${i}">${getOptions(n)}</select>`, '');

function getOptions(single) {
  return single.values.reduce((f, n, i) => f + `<option value="${typeof n === 'object'
    ? n.value
    : n}">${typeof n === 'object'
      ? n.label
      : n}</option>`, '');
}

function slOp(sl, index) {
  console.log(...vars.single[index].pars, sl.value);
  if (sl.value.trim() != '') {
    document.execCommand(...vars.single[index].pars, sl.value);
  }
}

function btnOp(type) {
  document.execCommand(...vars.btn[type]);
}

let opRange;

function inputOp(input, index) {
  console.log('input', input.value, index);
  if (input.value.trim() != ''&&document.activeElement==input) {
    edt.focus();
    let sl = window.getSelection();
    let inRange = opRange;
    sl.collapse(inRange.startContainer, inRange.startOffset);
    sl.extend(inRange.endContainer, inRange.endOffset);
    document.execCommand(...vars.input[index].pars,input.value);
  }
}

let code = document.getElementById('code');
let lines = document.getElementById('lines');
let edt = document.getElementsByClassName('editor')[0];

function resizeImg(e) {
  console.log(e);
  e.preventDefault();
  return false;
}

let opImg = [];

let popupwindow = document.createElement('div');
popupwindow.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(88,88,88,0.3);';
// popupwindow.innerHTML = '<div style="margin:40px auto;width:600px;"></div>';

function addImg(el) {
  opEl = el;
  let html = `
    <div style="margin:40px auto;width:600px">
      <div style="margin:10px;box-shadow:0 2px 8px 1px #888;padding:8px;background-color:#fff;border-radius:4px;">
        <div style="margin-bottom:10px"><img src="${el.src}" style="width:100%"></div>
        <div>
          <select>
            <option ${el.style.width
    ? 'selected'
    : ''}>width</option>
            <option ${el.style.height
      ? 'selected'
      : ''}>height</ption>
          </select>
          <input value="${el.style.width
        ? el.style.width
        : el.style.height}" placeholder="default is 100%">
        </div>
        <div>
          <button id="edt-img-save">save</buttopn>
          <button id="edt-img-close">close</buttopn>
        </div>
      </div>
    </div>`;
  popupwindow.innerHTML = html;
  popupwindow.getElementsByTagName('input')[0].addEventListener('keyup', enterClick);
  [...popupwindow.getElementsByTagName('button')].forEach((e, i) => e.addEventListener('click', i == 0
    ? saveWindow
    : closeWindow));
}

let opEl = undefined;

function enterClick(e) {
  console.log(e);
  if (e.keyCode == 13) {
    saveWindow();
  }
}

function showPopup() {
  if (popupwindow.parentNode) {
    popupwindow.style.display = "block";
  } else {
    document.body.appendChild(popupwindow);
  }
}

function saveWindow() {
  opEl.style.width = '';
  opEl.style.height = '';
  opEl.style[popupwindow.getElementsByTagName('select')[0].value] = popupwindow.getElementsByTagName('input')[0].value;
  closeWindow();
}

function closeWindow() {
  popupwindow.style.display = 'none';
}

edt.addEventListener('dblclick', e => {
  console.log(e);
  if (e.srcElement.tagName == 'IMG') {
    let offset = [...e.srcElement.parentNode.childNodes].indexOf(e.srcElement);
    window.getSelection().collapse(e.srcElement.parentNode, offset);
    window.getSelection().extend(e.srcElement.parentNode, offset + 1);
    addImg(e.srcElement);
    showPopup();
  } else if (e.srcElement.tagName == 'DIV') {} else {
    console.log(e.srcElement.tagName);
  }
})
document.addEventListener('selectionchange', e => {
  if (document.activeElement === edt) {
    let range = window.getSelection().getRangeAt(0);
    let s = range.commonAncestorContainer;
    let frag = range.cloneContents();
    let {startContainer, startOffset, endContainer, endOffset} = range;
    opRange = {
      startContainer,
      startOffset,
      endContainer,
      endOffset
    };
    console.log(e)
  }
})
// edt.addEventListener('mouseover',e=>{
//   if(e.toElement.tagName === 'IMG'){
//     console.log(e.fromElement,e.toElement,e.relatedTarget)
//     e.toElement.addEventListener('drag',resizeImg);
//     if(!opImg.includes(e.toElement)){
//       opImg.push(e.toElement);
//     }
//   } else {
//     opImg.forEach(e=>{
//       console.log('remove',e);
//       e.removeEventListener('drag',resizeImg)
//     });
//     opImg = [];
//   }
// });
