import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
    doctorDepartment: "",
  });

  const [docAvatar, setDocAvatar] = useState(null);
  const [docAvatarPreview, setDocAvatarPreview] = useState("/docHolder.jpg");
  const [loading, setLoading] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Avatar Upload
  const handleAvatar = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setDocAvatar(file);
    setDocAvatarPreview(URL.createObjectURL(file));
  };

  // Submit Form
  const handleAddNewDoctor = async (e) => {
    e.preventDefault();

    if (!docAvatar) {
      return toast.error("Doctor avatar is required");
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      submitData.append("docAvatar", docAvatar);

      const { data } = await axios.post(
        "https://hms-main.vercel.app/api/v1/user/doctor/addnew",
        submitData,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      // Reset Form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nic: "",
        dob: "",
        gender: "",
        password: "",
        doctorDepartment: "",
      });

      setDocAvatar(null);
      setDocAvatarPreview("/docHolder.jpg");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo" />

        <h1 className="form-title">REGISTER A NEW DOCTOR</h1>

        <form onSubmit={handleAddNewDoctor}>
          <div className="first-wrapper">
            <div className="avatar-section">
              <img
                src={docAvatarPreview}
                alt="Doctor Avatar"
                className="avatar-preview"
              />
              <input type="file" onChange={handleAvatar} />
            </div>

            <div className="form-fields">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="nic"
                placeholder="NIC"
                value={formData.nic}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <select
                name="doctorDepartment"
                value={formData.doctorDepartment}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register New Doctor"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;