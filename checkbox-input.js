(function (document, window) {

  if(!window.customElements || !HTMLElement.prototype.attachShadow) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.2.0/webcomponents-sd-ce.js', loadCheckboxInput )
  } else {
    loadCheckboxInput();
  }
  

  function loadScript(url, callback){
      const script = document.createElement("script")
      script.type = "text/javascript";
      if (script.readyState){
          script.onreadystatechange = function(){
              if (script.readyState === "loaded" || script.readyState === "complete"){
                  script.onreadystatechange = null;
                  callback();
              }
          };
      } else {
          script.onload = function (){ callback() };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
  }

  function loadCheckboxInput() {
    if (!window.customElements.get('checkbox-input')) {
      window.customElements.define('checkbox-input',
        class CheckboxInput extends HTMLElement {

          static get observedAttributes() { return ['is-checked']; }

          constructor() {
            super();
            this._root = null;
            this._state = {
              checked: 'false'
            };
          }

          connectedCallback() {
            if (this._root === null) {
              if (!!this.attachShadow) {
                this._root = this.attachShadow({ mode: "open" });
              } else {
                this._root = this;
              }
            }
            render.bind(this)();
          }

          attributeChangedCallback(name, oldValue, newValue) {
            if (newValue === oldValue) { return };
            if (name === 'is-checked') { this._state.checked = newValue; }
            render.bind(this)();
          }

          get checked(){ return this._state.checked; }
      });
    }
    
    function render() {
      if (window.ShadyCSS) ShadyCSS.styleElement(this);
      if (!!this._root) {
        let $template = document.createElement("template");
        $template.id = 'checkbox-input-template';
        $template.innerHTML = `
          <style>
            :host {
              position: relative;
              cursor: pointer;
              display: flex;
              align-items: center;
              width: 100%;
              margin: 5px 0;
              padding: 0;
              font-weight: 300;
              font-family: inherit;
              font-size: inherit;
            }

            .checkbox_input__input {
              outline: 0;
              cursor: pointer;
              -webkit-appearance: none;
              -moz-appearance: none;
              border-color: rgba(255,255,255,0);
              outline-color: rgba(255,255,255,0);
              top: calc(calc(50% - .5rem) - 4px);
              left: 0px;
              margin: 0;
              padding: 0;
              position: absolute;
              width: 100%;
              height: 1rem;
              background: rgba(255,255,255,0);    
            }

            .checkbox_input__input:before {
              content: "";
              position: absolute;
              top: calc(calc(50% - .5rem) + 1px);
              border-radius: 4px;
              display: block;
              width: 1rem;
              height: 1rem;
              background: #fff;
              margin: 0;
              padding: 0;
              border: 2px solid #bdbdbd;
            }

            .checkbox_input__input:checked:before {
              display: block;
              height: 1rem;
              width: 1rem;
              border-radius: 4px;
            }

            .checkbox_input__icon {
              height: 1rem;
              width: 1rem;
              margin: 0;
              padding: 0;
              border: 2px solid #3777bc;
              border-radius: 4px;
              fill: #fff;
              opacity: 0;
              pointer-events: none;
              background-color: #3777bc;
              transform: scale3d(0.0,0.0,0.0);
              transition: opacity 0.35s, transform 0.35s;
            }

            .checkbox_input__input:checked + 
            .checkbox_input__icon {
              opacity: 1;
              transform: scale3d(1,1,1);
              transition: opacity 0.35s, transform 0.35s;
            }

          </style>
          <input class="checkbox_input__input" type="checkbox" />
          <svg preserveAspectRatio="xMidYMid meet" class="checkbox_input__icon" display="checkmark" viewBox="0 0 24 24">
            <g>
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
            </g>
          </svg>
          <slot></slot>
        `;
        if (window.ShadyCSS) ShadyCSS.prepareTemplate($template, 'checkbox-input');
        this._root.appendChild(document.importNode($template.content, true));
        this._root.querySelector('input').addEventListener('click', onClickHandler.bind(this));
      
        function onClickHandler(evt) {
          this._state.checked = this._root.querySelector('input').checked ? true : false;
          this.dispatchEvent(checkboxInputCheckedEvent(this));
        }
    
        function checkboxInputCheckedEvent(component) {
          return new CustomEvent('checkboxInputChecked', {
            composed: true,
            cancelable: true,
            detail: { disabled: false, checked: component._state.checked }
          });
        }
      }
    }
  }
})(document, window);