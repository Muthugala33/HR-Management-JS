const API_BASE_URL = 'http://localhost:8080';

async function makeApiCall(url, method, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Only try to parse JSON if there is content
    const text = await response.text();
    return text ? JSON.parse(text) : {};
    
}

// Add Employee
document.getElementById('addEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const employeeData = {
        name: document.getElementById('addName').value,
        email: document.getElementById('addEmail').value,
        department: document.getElementById('addDepartment').value
    };

    
    try {
        await makeApiCall(`${API_BASE_URL}/employee/add`, 'POST', employeeData);
        alert('Employee added successfully!');
        this.reset();
    } catch (error) {
        alert('Failed to add employee: ' + error.message);
    }
});

// Search Employee
document.getElementById('searchEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('searchId').value;
    const resultDiv = document.getElementById('searchResult');

    try {
        const employee = await makeApiCall(`${API_BASE_URL}/employee/search-employee-by-id/${id}`, 'GET');
        document.getElementById('searchResultId').textContent = employee.id;
        document.getElementById('searchResultName').textContent = employee.name;
        document.getElementById('searchResultEmail').textContent = employee.email;
        document.getElementById('searchResultDepartment').textContent = employee.department;
        resultDiv.style.display = 'block';
    } catch (error) {
        alert('Employee not found!');
        resultDiv.style.display = 'none';
    }
});

// Update Employee
document.getElementById('updateEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('updateId').value;
    const employeeData = {
        id,
        name: document.getElementById('updateName').value,
        email: document.getElementById('updateEmail').value,
        department: document.getElementById('updateDepartment').value
    };

    try {
        await makeApiCall(`${API_BASE_URL}/employee/update-employee/${id}`, 'PUT', employeeData);
        alert('Employee updated successfully!');
        this.reset();
    } catch (error) {
        alert('Failed to update employee: ' + error.message);
    }
});

// Delete Employee
document.getElementById('deleteEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('deleteId').value;
    const resultDiv = document.getElementById('deleteResult');

    try {
        await makeApiCall(`${API_BASE_URL}/employee/delete-employee/${id}`, 'DELETE');
        resultDiv.textContent = 'Employee deleted successfully!';
        resultDiv.className = 'mt-4 alert alert-success';
        resultDiv.style.display = 'block';
        this.reset();
    } catch (error) {
        resultDiv.textContent = 'Failed to delete employee: ' + error.message;
        resultDiv.className = 'mt-4 alert alert-danger';
        resultDiv.style.display = 'block';
    }
});
