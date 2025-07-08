document
  .getElementById("registration-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const age = document.getElementById("age").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (
      !fname ||
      !lname ||
      !age ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      alert("Enter every field");
      return;
    }

    if (confirmPassword !== password) {
      alert("Enter the same password");
      return;
    }

    const user = {
      fname: fname,
      lname: lname,
      age: age,
      phoneNumber: phoneNumber,
      password: password,
    };
    try {
      const res = await fetch("http://localhost:5173/register", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        alert("You have successfully registered");
        window.location.href = "../index.html";
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      console.log(error);
      alert("Error Registering");
    }
  });
