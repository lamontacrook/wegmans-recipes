import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

async function getPim(url) {
  const pimURL = new URL(url);
  const resp = await fetch(pimURL);
  const json = await resp.json();
  const ul = document.createElement('ul');
  ul.classList.add('ingredients-purchase');

  json.data.forEach((row) => {
    const li = document.createElement('li');
    const divImage = document.createElement('div');

    divImage.appendChild(createOptimizedPicture(row.thumbnail));

    const divDesc = document.createElement('div');
    const desc = document.createElement('p');
    desc.textContent = row.description;
    divDesc.appendChild(desc);

    const price = document.createElement('p');
    price.textContent = row.price;
    divDesc.appendChild(price);

    const add2Cart = document.createElement('div');
    add2Cart.classList.add('add-to-cart-trigger');
    li.appendChild(divImage);
    li.appendChild(divDesc);
    li.appendChild(add2Cart);
    ul.appendChild(li);
  });

  return ul;
}

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const items = [...block.children];

  items.forEach((item) => {
    const left = item.querySelector('div>div');
    let div = document.createElement('div');
    div.classList.add('side-rail-item');
    [...left.children].forEach((blk) => {
      if (blk.tagName === 'HR') {
        blk.remove();
        left.append(div);
        div = document.createElement('div');
        div.classList.add('side-rail-item');
      } else {
        div.append(blk);
      }
    });
  });

  const btnElement = cols[1].querySelector('p>a');
  const pimElement = document.createElement('div');
  const pimList = await getPim(btnElement.href);
  btnElement.replaceWith(pimList);
}
