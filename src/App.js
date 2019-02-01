
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Formik, Form, Field } from "formik";
import AceEditor from 'react-ace';
import MonacoEditor from 'react-monaco-editor';
import Axios from 'axios';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/terminal';
import 'brace/theme/monokai';
import Editor from 'react-simple-code-editor';
import {Controlled as CodeMirror} from 'react-codemirror2';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import styled from 'styled-components';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
// function onChange(newValue) {
//   console.log('change',newValue);
// }

const headerProps = { text: 'I\'m styled!' };

const scope = {styled, headerProps};

const code = `const Header = styled.div\`
    color: palevioletred;
    font-size: 18px;
  \`
  render(<Header>{headerProps.text}</Header>)
`

class App extends Component {
  state = { code };

  constructor(){
    super();
    this.click=this.click.bind(this)
    this.state={
      aceEditorValue:"",
      result:"",
      code: '',

    }
  }

  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }

  onChange = (newValue) => {
    this.setState({
      aceEditorValue: newValue
    });
    console.log(this.state.aceEditorValue)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.aceEditorValue !== nextState.aceEditorValue) {
      return false
    } else {
      return true;
    }
  }
  click(){
    const urlget = "https://leetcode.com/submissions/detail/"
    const lang = "javascript"
    const typed_code=this.state.aceEditorValue
    const data_input = ""
    const body={
      lang,
      typed_code,
      data_input
    }
    Axios.post('https://leetcode.com/playground/api/runcode',body).then(ress=>{
      Axios.get(urlget+ress.data.interpret_id+'/check').then(res=>{
        console.log(res)
        if(res.data.state==="STARTED"){
          Axios.get(urlget+ress.data.interpret_id+'/check').then(re=>{
            console.log(re.data.code_output)
            this.setState({result:re.data.code_output})
          }
          )
        }else{
          this.setState({result:res.data.code_output})
        }
      })
      console.log(ress)
    })
    console.log(this.state.aceEditorValue)
  }
  render() {
    const code = this.state.code;

    
    return (
      <div className="App">
        <div>
          <LiveProvider code={code} scope={scope} noInline={true}>
            <LiveEditor onChange={this.onChange}
              style={{
                width:"100%",
                maxWidth: "100%",
                height: "500px",
                maxHeight: "500px",
                flexBasis: "auto",
                overflow: "scroll"
              }}
            />
          </LiveProvider>
        </div>
        {/* <CodeMirror
          value={this.state.value}
          onBeforeChange={(editor, data, value) => {
            this.setState({value});
          }}
          onChange={this.onChange}
        /> */}
                    {/* <Editor
              placeholder="Type some code…"
              value={this.state.aceEditorValue}
              onValueChange={this.onChange}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              tabSize={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                position: 'sticky'
              }}
            /> */}
        {/* <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      /> */}
        {/* <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={this.onChange}
        name="UNIQUE_ID_OF_DIV"
        blockScrolling="disable"
        editorProps={{$blockScrolling: true}}
        setOptions={{
        enableBasicAutocompletion: true,}}
        /> */}
        <p>{"Result: "+this.state.result}</p>
        <button onClick={this.click}>Run Code!</button>
      </div>
    );
  }
}

export default App;
