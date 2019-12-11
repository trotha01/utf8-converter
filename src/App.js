import React, { Component } from 'react';
import './App.css';
// const utf8 = require('utf8');
const encoding = require ('encoding-japanese');

function fileChanged(file, setState) {
  if (!file) {
    console.log('no file selected')
    return
  }

  const reader = new FileReader();
  reader.onloadend = fileLoaded(reader, setState)
  reader.readAsText(file)
}

const fileLoaded = (reader, setState) => event => {
  const content = reader.result
  const encodingType = encoding.detect(content)
  console.log(encodingType)

  if (encodingType === 'UTF8') {
    setState({
      description: "This file is already utf8",
      loading: false
    })
    return
  }
  /*
  if (encodingType === 'UNICODE' || encodingType === 'UTF16') {
    setState({
      description: "This file is utf16, no conversion needed",
      loading: false
    })
    return
  }
  */

  setState({
    description: `The file was ${encodingType}. Converted to UTF16`,
    before: content,
    // after: utf8.encode(content),
    // after: encoding.convert(content, 'UTF16'),
    after: encoding.convert(content, 'UTF8'),
    loading: false
  })
}

class App extends Component {
   constructor(props) {
     super(props)
     this.state = {
       description: "",
       loading: false,
       before: "",
       after: "",
     }
   }

  render() {
    const { description, before, after, loading } = this.state


    const onFileChanged = (e) => {
      const file = e.target.files[0]
      const setState = (newState) => this.setState(newState)
      // console.log(downloadLink)
      this.setState({loading: true, description: ""}, () => fileChanged(file, setState))
    }

    const download = (e) => {
      this.refs.downloadLink.click()
    }

    const linkStyle = {
      height: '0px',
      width: '0px'
    }

    const beforeView = (
      <div>
        <h1>Before</h1>
        <p>{before}</p>
      </div>
    )

    const afterView = (
      <div>
        <h1>After</h1>
        <p>{after}</p>
      </div>
    )

    const loader = <div className="loader"></div>
    const downloadable = after.length > 0

    return (
      <div className="App">
        <header className="App-header">

          <p>Convert File to UTF8</p>

          <input type="file"
            ref="fileInput"
            onChange={onFileChanged}>
          </input>

          <p>{description}</p>
          
          { downloadable ? <button onClick={download}>Download UTF8 Converted File</button> : null }

          {loading ? loader :
            <div className='row'>
              <div className='column'>
                {(before.length > 0) ? beforeView : null}
              </div>

              <div className='column'>
                {loading ? loader : null}
                {(after.length > 0) ? afterView : null}
              </div>
            </div>
          }
  
          <a ref='downloadLink' 
            style={linkStyle}
            download='utf8converted.csv'
            href={'data:text/csv; charset=utf-8,' + after}>
          </a>

        </header>
      </div>
    );
  }
}

export default App;
