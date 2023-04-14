export const login = async (user) => {
  return fetch("http://localhost:3000/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user
    }),
    credentials: "include"
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Login failed");
    }
  })
  .then(data => {
    if (data.logged_in) {
      return data;
    } else {
      throw new Error("Login failed");
    }
  })
  .catch(error => {
    console.error("login error", error);
    return null;
  });
};

export const register = async (user) => {
  return fetch("http://localhost:3000/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user
      }),
      credentials: "include"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Registration failed");
      }
    })
    .then(data => {
      if (data.status === "created") {
        return data;
      }
    })
    .catch(error => {
      return null;
    });

};


