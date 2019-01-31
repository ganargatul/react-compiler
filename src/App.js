import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Formik, Form, Field } from "formik";
import AceEditor from 'react-ace';
import Axios from 'axios';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/terminal';
import 'brace/theme/monokai';
// function onChange(newValue) {
//   console.log('change',newValue);
// }

class App extends Component {
  constructor(){
    super();
    this.click=this.click.bind(this)
    this.state={
      aceEditorValue:"",
      result:""
    }
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
    
    return (
      <div className="App">
        <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={this.onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{$blockScrolling: true}}
        setOptions={{
        enableBasicAutocompletion: true,}}
        />
        <p>{"Result: "+this.state.result}</p>
        <button onClick={this.click}>Run Code!</button>
      </div>
    );
  }
}

export default App;
