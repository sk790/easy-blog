import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './components/Header'
// import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import { Toaster } from 'react-hot-toast';
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Home from './pages/Home';
import Footer from './components/Footer';
function App() {

  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/projects' element={<Projects/>}/>
        </Routes>
        <Footer/>
        <Toaster/>
      </BrowserRouter>
    </>
  )
}

export default App
