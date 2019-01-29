import React, { Component } from 'react';
import './App.css';
const utf8 = require('utf8');
const encoding = require ('encoding-japanese');

class App extends Component {
   constructor(props) {
     super(props)
     this.state = {
       description: "",
     }
   }

  render() {
    let {description} = this.state

    const onFileChanged = event => {
      event.preventDefault()
      const { downloadLink } = this.refs
      const file = event.target.files[0]

      if (!file) {
        console.log('no file selected')
        return
      }

      console.log(file)
      const reader = new FileReader();

      reader.onloadend = (e) => {
        const content = reader.result
        const encodingType = encoding.detect(content)
        console.log(encodingType)

        if (encodingType === 'UTF8') {
          this.setState({description: "This file is already utf8"})
          return
        }

        console.log('not valid utf8, converting')
        downloadLink.href = 'data:text/csv; charset=utf-8,' + utf8.encode(content)
        downloadLink.click()
        this.setState({description: "Converted file to utf8"})
      };

      reader.readAsText(file)
    }

    const linkStyle = {
      height: '0px',
      width: '0px'
    }

    return (
      <div className="App">
        <header className="App-header">

          <p>Convert File to UTF8</p>

          <input type="file"
            ref="fileInput"
            onChange={onFileChanged}>
          </input>

          <p>{description}</p>

          <a ref='downloadLink' 
            style={linkStyle}
            download='utf8converted.csv'
            href='data:text/csv; charset=utf-8,'>
          </a>

        </header>
      </div>
    );
  }
}

export default App;
