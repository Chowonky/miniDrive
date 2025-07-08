const fullname = document.getElementById("name");
const age = document.getElementById("age");
const phoneNumber = document.getElementById("phone-number");
const uploadedFiles = document.getElementById("display-uploaded-files");

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(loggedInUser);

fullname.innerHTML += loggedInUser.fname + " " + loggedInUser.lname;
age.innerHTML += loggedInUser.age;
phoneNumber.innerHTML += loggedInUser.phonenumber;

document.getElementById("upload-file").addEventListener("click", async () => {
  const inputFile = document.getElementById("input-file");
  const file = inputFile.files[0]; //get first file from files array

  const reader = new FileReader(); //create file reader
  reader.readAsDataURL(file); //read the file as base64 string

  reader.onload = async function () {
    //wait for the file to be read then execute function
    console.log("file read");
    const fileContent = reader.result; //copy result of the read operation

    const fileObj = {
      name: file.name,
      size: Math.ceil(file.size / 1024) + " KB", //create file object with file data
      type: file.type,
      content: fileContent,
      phoneNumber: loggedInUser.phonenumber,
    };

    try {
      const res = await fetch("http://localhost:5173/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileObj),
      });

      if (res.ok) {
        alert("File uploaded succesfully ");
        window.location.reload();
      } else {
        alert("failed to upload file");
      }
    } catch (error) {
      alert("File uploading failed");
    }
  };
});

(async () => {
  try {
    const files = await fetch(
      `http://localhost:5173/files/${loggedInUser.phonenumber}`
    );
    const data = await files.json();

    for (const f of data.files) {
      uploadedFiles.innerHTML += `
        <div class="uploaded-files">
          <b>${f.name}</b> (${f.size})
            <a class="download-btn" href="${f.content}" download="${f.name}">Download</a>
            <button data-id="${f.id}" class="delete-btn">Delete</button>
      
        </div>
        
      `;
    }

    uploadedFiles.innerHTML+="</br>";
  } catch (error) {
    console.log("Error loading files", error);
    uploadedFiles.innerHTML = "Failed to load uploaded files";
  }

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const fileId = btn.getAttribute("data-id");
      if (!confirm("Are you sure you want to delete this file?")) return;
      try {
        const res = await fetch(`http://localhost:5173/files/${fileId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("File deleted successfully");
          window.location.reload();
        } else {
          alert("Failed to delete file");
        }
      } catch (err) {
        console.error("Error deleting file:", err);
        alert("An error occurred while deleting the file");
      }
    });
  });
})();
