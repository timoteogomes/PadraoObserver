class Observer {
    constructor() {
      this.observers = [];
    }
  
    subscribe(fn) {
      this.observers.push(fn);
    }
  
    unsubscribe(fn) {
      this.observers = this.observers.filter((subscriber) => subscriber !== fn);
    }
  
    fire(data) {
      this.observers.forEach((observer) => observer(data));
    }
  }
  
  class TextEditor extends Observer {
    constructor() {
      super();
      this.text = [];
    }
  
    insertLine(lineNumber, text) {
      if (lineNumber < 0 || lineNumber > this.text.length) {
        throw new Error('Invalid line number');
      }
      this.text.splice(lineNumber, 0, text);
    }
  
    removeLine(lineNumber) {
      if (lineNumber < 0 || lineNumber >= this.text.length) {
        throw new Error('Invalid line number');
      }
      this.text.splice(lineNumber, 1);
    }
  
    open() {
      this.fire('open');
    }
  
    save() {
      this.fire('save');
    }
  }
  
  const textEditor = new TextEditor();
  
  textEditor.subscribe((event) => {
    if (event === 'open') {
      console.log('Editor opened.');
    } else if (event === 'save') {
      console.log('Content saved.');
      console.log('Content:');
      textEditor.text.forEach((line, index) => {
        console.log(`${index}: ${line}`);
      });
    }
  });
  
  textEditor.open();
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const handleInput = () => {
    readline.question('Enter text: ', (input) => {
      if (input.trim().toLowerCase() === 'eof') {
        textEditor.save();
        readline.close();
      } else {
        textEditor.insertLine(textEditor.text.length, input);
        handleInput();
      }
    });
  };
  
  handleInput();