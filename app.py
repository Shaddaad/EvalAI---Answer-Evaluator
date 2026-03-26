<script>

    // check login immediately
    const token = localStorage.getItem("token")
    
    if(!token){
        alert("Please login first")
        window.location="/"
    }
    
    // create exam
    async function createExam(){
    
    const token = localStorage.getItem("token")
    
    const exam_name = document.getElementById("exam_name").value
    const class_name = document.getElementById("class_name").value
    const marks = parseInt(document.getElementById("marks").value)
    const date = document.getElementById("date").value
    
    const res = await fetch("/teacher/create-exam",{
    method:"POST",
    headers:{
    "Content-Type":"application/json",
    "Authorization":"Bearer "+token
    },
    body:JSON.stringify({
    exam_name: exam_name,
    class: class_name,
    max_marks: marks,
    date: date,
    valuation_type: "moderate"
    })
    })
    
    const data = await res.json()
    
    document.getElementById("exam_result").innerText =
    JSON.stringify(data,null,2)
    
    }
    
    </script>