
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const phoneNumber = document.getElementById("phone-number").value;
  const password = document.getElementById("password").value;

  if (!phoneNumber || !password) {
    alert("Enter every field");
    return;
  }
  const user = {
    phoneNumber: phoneNumber,
    password: password,
  };

  try {
    const res = await fetch("http://localhost:5173/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      alert("You have successfully logged in");
      delete data.user.password;
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      window.location.href = "./dashboard.html";
    } else {
      const data = await res.json();
      console.log(data.error);
      alert("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    alert("Error Fetching");
  }
});
