import { useState } from 'react';
import Icon from '../icons/Icon.jsx';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div className={`accordion-item ${open === index ? 'open' : ''}`} key={item.title}>
          <button className="accordion-header" type="button" onClick={() => setOpen(open === index ? -1 : index)}>
            <span>{item.title}</span>
            <Icon name="chevronDown" className="icon icon-sm" />
          </button>
          <div className="accordion-body">
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
