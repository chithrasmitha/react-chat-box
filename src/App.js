import logo from './logo.svg';
import './App.css';
import React,{useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({

  apiKey: "AIzaSyC9Z4Y2Rn02XeW8oTbnBSrHLAYkLAjqGNc",
    authDomain: "chatbox-f3743.firebaseapp.com",
    projectId: "chatbox-f3743",
    storageBucket: "chatbox-f3743.appspot.com",
    messagingSenderId: "130552617001",
    appId: "1:130552617001:web:ad7e511b41409db286e438",
    measurementId: "G-4XX9YWYL8Z"

})

const auth=firebase.auth();
const firestore=firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <ChatBox /> : <SignIn/>}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>

  )
}
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}

function ChatBox() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const[messages]=useCollectionData(query,{idField: 'id'});
  const[formValue,setFormValue]= useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid,photoURL}=auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,photoURL

    });
    setFormValue('');
  }

return (
  <>
  <div>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  </div>
  <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
    <button type="submit">send</button>

  </form>
  </>
)
}
function ChatMessage(props){
  const {text,uid}=props.message;
  //const messageClass=uid===auth.currentUser.uid ? 'sent' : 'received';
  return (
    //<div className={`message ${messageClass}`}>
     // <img src={photoURL} />
      <p>{text}</p>

   // </div>
  )
}
export default App;
