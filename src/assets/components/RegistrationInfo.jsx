import { useEffect, useState } from 'react';

function RegistrationInfo() {
	const [registrations, setRegistrations] = useState([]);
	const [uniqueStudents, setUniqueStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [studentDetails, setStudentDetails] = useState(null);
	const [studentCourses, setStudentCourses] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch all registrations and get unique students
	const fetchRegistrations = async () => {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:3000/registrations');
			const data = await response.json();
			setRegistrations(data.registration);

			// Extract unique student IDs
			const studentSet = new Set(
				data.registration.map((reg) => reg.student_id)
			);
			setUniqueStudents([...studentSet]);
			setError(null);
		} catch (err) {
			setError('Failed to fetch registrations.');
		} finally {
			setLoading(false);
		}
	};

	// Fetch student details
	const fetchStudentDetails = async (studentId) => {
		try {
			setLoading(true);
			const response = await fetch(
				`http://localhost:3000/students/${studentId}`
			);
			const data = await response.json();
			setStudentDetails(data[0]); // Assuming response is an array with one object
			setError(null);
		} catch (err) {
			setError('Failed to fetch student details.');
		} finally {
			setLoading(false);
		}
	};

	// Fetch courses for a specific student
	const fetchStudentCourses = async (studentId) => {
		try {
			setLoading(true);
			const response = await fetch(
				`http://localhost:3000/registrations/${studentId}`
			);
			const data = await response.json();
			setStudentCourses(data.courses);
			setError(null);
		} catch (err) {
			setError('Failed to fetch courses for the student.');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (studentId, courseId) => {
		const confirmDelete = window.confirm(
			`Are you sure you want to delete the course with ID ${courseId} for student ${studentId}?`
		);

		if (!confirmDelete) return;

		try {
			const response = await fetch(
				`http://localhost:3000/registrations/${studentId}/${courseId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				alert('Course registration deleted successfully.');
				// Update the UI after deletion
				setStudentCourses((prevCourses) =>
					prevCourses.filter(
						(course) => course.course_id !== courseId
					)
				);
			} else {
				const error = await response.json();
				alert(`Failed to delete: ${error.message}`);
			}
		} catch (error) {
			console.error('Error deleting course registration:', error);
			alert('An error occurred while deleting the course registration.');
		}
	};

	// State for new course
	const [newCourseId, setNewCourseId] = useState('');

	const handleAddCourse = async (e) => {
		e.preventDefault();

		if (!newCourseId) {
			alert('Please enter a valid Course ID.');
			return;
		}

		try {
			const response = await fetch(
				'http://localhost:3000/registrations',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						student_id: studentDetails.student_id,
						course_id: newCourseId,
					}),
				}
			);

			if (response.ok) {
				alert('Course added successfully.');
				const addedCourse = await response.json();
				// Fetch updated courses or add the new course to the state manually
				setStudentCourses((prevCourses) => [
					...prevCourses,
					addedCourse,
				]);
				setNewCourseId('');
				closeModal();
			} else {
				const error = await response.json();
				alert(`Failed to add course: ${error.message}`);
			}
		} catch (error) {
			console.error('Error adding course:', error);
			alert('An error occurred while adding the course.');
		}
	};

	// Handle student selection
	const handleStudentSelection = async (studentId) => {
		setSelectedStudent(studentId);
		await fetchStudentDetails(studentId);
		await fetchStudentCourses(studentId);
		setShowModal(true);
	};

	// Close the modal
	const closeModal = () => {
		setShowModal(false);
		setSelectedStudent(null);
		setStudentDetails(null);
		setStudentCourses([]);
	};

	useEffect(() => {
		fetchRegistrations();
	}, []);

	return (
		<div className='p-8 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold text-center mb-6'>
				Student Registrations
			</h1>

			{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

			{loading && <p className='text-center'>Loading...</p>}

			{/* Display all unique students */}
			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-xl font-semibold mb-4'>Students</h2>
				<table className='min-w-full bg-white rounded-lg shadow-md'>
					<thead>
						<tr className='bg-gray-200 text-gray-700 text-left'>
							<th className='px-6 py-3 font-semibold'>
								Student ID
							</th>
							<th className='px-6 py-3 font-semibold'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{uniqueStudents.map((studentId) => (
							<tr key={studentId} className='hover:bg-gray-100'>
								<td className='px-6 py-4 text-gray-800'>
									{studentId}
								</td>
								<td className='px-6 py-4 text-center'>
									<button
										onClick={() =>
											handleStudentSelection(studentId)
										}
										className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all'
									>
										View Details
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-white w-11/12 max-w-4xl p-6 rounded-lg shadow-lg relative overflow-auto max-h-[90vh]'>
						{/* Close button */}
						<button
							onClick={closeModal}
							className='absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-red-600 transition-all'
						>
							✕
						</button>

						{/* Student details */}
						{studentDetails && (
							<div>
								<h2 className='text-xl font-semibold mb-4'>
									Details for Student: {studentDetails.name} (
									{studentDetails.student_id})
								</h2>
								<p>
									<strong>Email:</strong>{' '}
									{studentDetails.email}
								</p>
								<p>
									<strong>Phone:</strong>{' '}
									{studentDetails.phone}
								</p>
								<p>
									<strong>Batch:</strong>{' '}
									{studentDetails.batch_no}
								</p>
								<p>
									<strong>Address:</strong>{' '}
									{studentDetails.address}
								</p>
							</div>
						)}

						{/* Add Course Section */}
						<h3 className='text-lg font-semibold mt-4'>
							Add a Course:
						</h3>
						<form
							onSubmit={handleAddCourse}
							className='flex items-center gap-4 mt-2'
						>
							<input
								type='text'
								placeholder='Enter Course ID'
								value={newCourseId}
								onChange={(e) => setNewCourseId(e.target.value)}
								className='border border-gray-300 rounded px-4 py-2 w-1/2'
							/>
							<button
								type='submit'
								className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all'
							>
								Add Course
							</button>
						</form>

						{/* Registered Courses */}
						<h3 className='text-lg font-semibold mt-4'>
							Registered Courses:
						</h3>
						{studentCourses.length > 0 ? (
							<table className='min-w-full bg-white rounded-lg shadow-md mt-2'>
								<thead>
									<tr className='bg-gray-200 text-gray-700 text-left'>
										<th className='px-6 py-3 font-semibold'>
											Course ID
										</th>
										<th className='px-6 py-3 font-semibold'>
											Course Name
										</th>
										<th className='px-6 py-3 font-semibold'>
											Course Description
										</th>
										<th className='px-6 py-3 font-semibold'>
											Credits
										</th>
										<th className='px-6 py-3 font-semibold'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{studentCourses.map((course) => (
										<tr
											key={course.course_id}
											className='hover:bg-gray-100'
										>
											<td className='px-6 py-4 text-gray-800'>
												{course.course_id}
											</td>
											<td className='px-6 py-4 text-gray-800'>
												{course.course_name}
											</td>
											<td className='px-6 py-4 text-gray-600'>
												{course.course_description}
											</td>
											<td className='px-6 py-4 text-gray-800'>
												{course.credits}
											</td>
											<td className='px-6 py-4'>
												<button
													onClick={() =>
														handleDelete(
															studentDetails.student_id,
															course.course_id
														)
													}
													className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all'
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p>No courses found for this student.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default RegistrationInfo;
