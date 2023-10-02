const selects = document.querySelectorAll("select");

for (const select of selects) {
  const div = document.createElement("div");
  const header = document.createElement("div");
  const datalist = document.createElement("datalist");
  const optgroups = select.querySelectorAll("optgroup");
  const span = document.createElement("span");
  const options = select.options;
  const parent = select.parentElement;
  const multiple = select.hasAttribute("multiple");

  // Create an array to store selected options for multiple select
  const selectedOptions = new Set();

  function onclick(e) {
    if(this.length==undefined){
      const disabled = this.hasAttribute("data-disabled");
      let value = this.dataset.value;
      if (disabled) return;
      if (multiple) {
        const checked = this.hasAttribute("data-checked");
        value = this.dataset.label;
        if (checked) {
          this.removeAttribute("data-checked");
          selectedOptions.delete(value);
        } else {
          this.setAttribute("data-checked", "true");
          selectedOptions.add(value);
        }
        updateSelectedText();
      } else {
        // For single select, set the value and close the dropdown
        select.value = value;
        span.innerText = this.dataset.label;
        div.removeAttribute("data-open");
      }
    }
  }

  function onkeyup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.keyCode === 13) {
      this.click();
    }
  }

  function updateSelectedText() {
    const selectedLabels = Array.from(selectedOptions).map(value => {
      console.log(value)
      const option = options.namedItem(value);
      return option ? option.label : value;
    });
    span.innerText = selectedLabels.join(", ");
  }

  div.classList.add("select");
  header.classList.add("header");
  div.tabIndex = 1;
  select.tabIndex = -1;
  span.innerText = select.label;
  header.appendChild(span);

  for (const attribute of select.attributes) {
    div.dataset[attribute.name] = attribute.value;
  }
  
  div.appendChild(header);
  

  div.onclick = (e) => {
    e.preventDefault();
  };

  parent.insertBefore(div, select);
  header.appendChild(select);
  div.appendChild(datalist);
  datalist.style.top = `${header.offsetTop + header.offsetHeight}px`;

  div.onclick = (e) => {
    // if (!multiple) {
      const open = div.hasAttribute("data-open");
      e.stopPropagation();
      // console.log(e.target.nextSibling.getElementsByTagName("option"))
      console.log(div)
      while (div.querySelector('datalist').firstChild) {
        div.querySelector('datalist').removeChild(div.querySelector('datalist').firstChild);
      }
      const getOptions = e.target.nextSibling.getElementsByTagName("option");
      for (let i = 0; i < getOptions.length; i++) {
        const option = document.createElement("div");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        const o = getOptions[i];
      
        for (const attribute of o.attributes) {
          option.dataset[attribute.name] = attribute.value;
        }
      
        option.classList.add("option");
        label.classList.add("label");
        checkbox.type = "checkbox";
        checkbox.value = o.value;
      
        if (multiple) {
          label.appendChild(checkbox);
        }
      
        label.appendChild(document.createTextNode(o.label));
        option.dataset.value = o.value;
        option.dataset.label = o.label;
        option.onclick = onclick;
        option.onkeyup = onkeyup;
        option.tabIndex = i + 1;
      
        // Add a class if the corresponding <option> is selected
        if (o.selected) {
          option.classList.add("selected");
        }
      
        option.appendChild(label);
        datalist.appendChild(option);
      }
      
      if (open) {
        div.removeAttribute("data-open");
      } else {
        div.setAttribute("data-open", "true");
      }
    // }
  };

  div.onkeyup = (event) => {
    event.preventDefault();
    console.log(event.keyCode)
    if (event.keyCode === 13) {
      div.click();
    }
  };

  document.addEventListener("click", (e) => {
    if (div.hasAttribute("data-open")) {
      div.removeAttribute("data-open");
      while (div.querySelector('datalist').firstChild) {
        div.querySelector('datalist').removeChild(div.querySelector('datalist').firstChild);
      }
    }
  });

  // Initialize selected options for multiple select
  function initSelectedOptions() {
    selectedOptions.clear();
    for (const option of options) {
      if (option.selected) {
        console.log(option)
        selectedOptions.add(option.label);
      }
    }
    updateSelectedText();
  }

  initSelectedOptions(); // Initialize selected options on load

  // Add an event listener for select change
  select.addEventListener("change", initSelectedOptions);
}
