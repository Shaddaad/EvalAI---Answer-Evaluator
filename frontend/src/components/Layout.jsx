import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"

function Layout(){

  return(

    <div style={styles.container}>

      <Sidebar />

      <div style={styles.main}>

        <Navbar />

        <div style={styles.content}>
          <Outlet />
        </div>

      </div>

    </div>

  )

}

const styles = {

  container:{
    display: "flex",
    height: "100vh",
    background: "#FAFAFA",
  },

  main:{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: "260px",
    minHeight: "100vh",
  },

  content:{
    padding: "32px 40px",
    overflow: "auto",
    flex: 1,
    maxWidth: "1200px",
  }

}

export default Layout