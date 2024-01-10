(async function () {
  const data = await fetch("./data.json");
  const res = await data.json();

  let employees = res;
  let selectedEmployeeId = employees[0].id;
  let selectedEmployee = employees[0];

  const employeesList = document.querySelector(".employees__names--list");
  const employeesInfo = document.querySelector(".employess__single--info");

  
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee__create");
  const editEmployeeBtn = document.querySelector(".editEmployee__btn");
  const editEmployee = document.querySelector(".editEmployee");
  const editEmployeeForm = document.querySelector(".editEmployee__create");
  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });
  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("addEmployee")) {
      addEmployeeModal.style.display = "none";
    }
  });

  // format date so that only 18 yrars and above are allowed 
  const dobInput = document.querySelector(".addEmployee__create--dob");
  dobInput.max = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    .toISOString()
    .split("T")[0];


//Add employee logic 

  addEmployeeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const data = [...formData.entries()];
    console.log(data);
    let empData = {};
    data.forEach((d) => {
      empData[d[0]] = d[1].trim();
    });
    empData.id = employees[employees.length - 1].id + 1;
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

    empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4));
    
    employees.push(empData);
    renderEmployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });


  // edit employee popup/modal 
  editEmployeeBtn.addEventListener("click", () => {
    editEmployee.style.display = "flex";
    document.querySelector("#firstname").value = selectedEmployee.firstName;
    document.querySelector("#lastname").value = selectedEmployee.lastName;
    document.querySelector("#imageUrl").value = selectedEmployee.imageUrl;
    document.querySelector("#contactNumber").value =
      selectedEmployee.contactNumber;
    document.querySelector("#salary").value = selectedEmployee.salary;
    document.querySelector("#email").value = selectedEmployee.email;
    document.querySelector("#address").value = selectedEmployee.address;
    let [day,month,year]=selectedEmployee.dob.split('/')
   let formattedDate = `${year}-${month}-${day}`;
    document.querySelector("#dob").value = formattedDate;
  });

  // editEmployee logic 
  editEmployee.addEventListener("click", (e) => {
    if (e.target.classList.contains("editEmployee")) {
      editEmployee.style.display = "none";
    }
  });
  editEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editEmployeeForm);
    let empData = {};
    for (let key of formData.entries()) {
      empData[key[0]] = key[1];
    }
    empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4));
    empData.id = employees[employees.length - 1].id + 1;
    employees = employees.map((employee) =>
      employee.id === parseInt(selectedEmployeeId) ? empData : employee
    );

    selectedEmployee = empData;
    selectedEmployeeId = empData.id;
    renderEmployees();
    renderSingleEmployee();
    editEmployeeForm.reset();
    editEmployee.style.display = "none";
  });
  // or
  // window.onclick=function(e){
  //     if(e.target.classList.contains('addEmployee')){
  //         addEmployeeModal.style.display='none'
  //     }
  // }

// select employee logic
 employeesList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;

      renderEmployees();
      renderSingleEmployee();
    } else if (e.target.classList.contains("employeeDelete")) {
      deleteSingleEmployee(e.target.parentNode.id);
    }
  });

  // deleteSingleEmployee logic 
  const deleteSingleEmployee = (empId) => {
    employees = employees.filter((emp) => emp.id !== parseInt(empId));

    selectedEmployee = employees[0] || {};
    selectedEmployeeId = employees[0]?.id || -1;
    renderSingleEmployee();
    renderEmployees();
  };

  // render initial employeess logic 
  const renderEmployees = () => {
    employeesList.innerHTML = "";
    employees?.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employees__names--item");
      if (parseInt(selectedEmployeeId) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} 
      ${emp.lastName}
      <i class="employeeDelete">❌</i>
      `;
      employeesList.appendChild(employee);
    });
  };
  //Render Single Employee
  const renderSingleEmployee = () => {
   

    if (selectedEmployeeId === -1) {
      employeesInfo.innerHTML = "";
      return;
    }
    employeesInfo.innerHTML = `
 
    <img src="${selectedEmployee?.imageUrl}" alt="${selectedEmployee?.firstName}" />

    <span class="employee__single--heading">
    ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}
    ${selectedEmployee?.age}
  </span>
  <span>${selectedEmployee?.address}</span>
  <span>${selectedEmployee?.email}</span>
  <span>${selectedEmployee?.contactNumber}</span>
  <span>${selectedEmployee?.dob}</span>
 
    `;
  };

  if (selectedEmployee) renderSingleEmployee();

  renderEmployees();
})();
