import React, {useContext, useEffect, useState} from 'react';
import Editor from '../components/Editor'

function CreatePage(props) {
  return (
    <div className="Page-wrapper">
      <Editor/>
    </div>
  );
}

export default CreatePage;