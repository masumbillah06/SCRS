import { useState } from 'react';
import { useForm } from 'react-hook-form';

function StudentInfo({ studentData, getStudents }) {
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const toggleForm = () => {
		setIsFormVisible(!isFormVisible);
		setIsEditMode(false);
		reset();
	};

	const onSubmit = async (data) => {
		const url = isEditMode
			? `http://localhost:3000/students/${data.student_id}`
			: 'http://localhost:3000/students';
		const method = isEditMode ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Failed to save student data');
			}

			const result = await response.json();
			alert(
				isEditMode
					? 'Student updated successfully!'
					: 'Student created successfully!'
			);
			reset();
			setIsFormVisible(false);
			setIsEditMode(false);
			setSelectedStudent(null);
			console.log(result);
			getStudents();
		} catch (err) {
			console.error('Error:', err.message);
			alert('Error saving student data. Please try again.');
		}
	};

	const handleUpdate = (student) => {
		setIsEditMode(true); // Switch form to edit mode
		setIsFormVisible(true); // Open the form
		reset(student); // Pre-fill the form with the student's current data
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete?')) {
			alert('deleting');
			try {
				const res = await fetch(
					`http://localhost:3000/students/${id}`,
					{
						method: 'DELETE',
					}
				);
				const data = await res.json();

				if (data.error) {
					alert(data.error);
					getStudents();
				} else {
					alert(`Deleted student with ID: ${id}`);
					getStudents();
				}
			} catch (err) {
				console.error('Error:', err.message);
				alert(`Deleted student with ID: ${id}`);
				getStudents();
			}
		} else {
			alert('Action canceled.');
		}
	};

	const handleFullDetails = (student) => {
		setSelectedStudent(student); // Set the student for viewing full details
	};

	const closeModal = () => {
		setSelectedStudent(null); // Clear the selected student to close the modal
	};

	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-overlay') {
			closeModal(); // Close the modal if clicked outside the modal content
		}
	};

	return (
		<div>
			<h1 className='text-3xl font-semibold text-center mb-5'>
				All Students
			</h1>
			<div className='p-8 bg-gray-100 min-h-screen'>
				<div className='mx-auto my-3'>
					{/* Toggle form button */}
					<button
						onClick={toggleForm}
						className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all'
					>
						{isFormVisible ? 'Close Form' : 'Create Student'}
					</button>

					{/* Student creation form */}
					{isFormVisible && (
						<div className='bg-white p-6 rounded-lg shadow-md mt-4'>
							<h1 className='text-2xl font-bold text-center mb-6'>
								{isEditMode
									? 'Update Student'
									: 'Create Student'}
							</h1>
							<form onSubmit={handleSubmit(onSubmit)}>
								{[
									{
										name: 'student_id',
										label: 'Student ID',
										type: 'text',
									},
									{
										name: 'name',
										label: 'Name',
										type: 'text',
									},
									{
										name: 'email',
										label: 'Email',
										type: 'email',
									},
									{
										name: 'phone',
										label: 'Phone',
										type: 'text',
									},
									{
										name: 'batch_no',
										label: 'Batch No',
										type: 'text',
									},
								].map(({ name, label, type }) => (
									<div className='mb-4' key={name}>
										<label
											htmlFor={name}
											className='block text-gray-700 font-bold mb-2'
										>
											{label}
										</label>
										<input
											type={type}
											id={name}
											className='w-full border border-gray-300 rounded-md p-2'
											{...register(name, {
												required: `${label} is required`,
											})}
										/>
										{errors[name] && (
											<p className='text-red-500 text-sm'>
												{errors[name].message}
											</p>
										)}
									</div>
								))}
								<div className='mb-6'>
									<label
										htmlFor='address'
										className='block text-gray-700 font-bold mb-2'
									>
										Address
									</label>
									<textarea
										id='address'
										className='w-full border border-gray-300 rounded-md p-2'
										rows='3'
										{...register('address', {
											required: 'Address is required',
										})}
									/>
									{errors.address && (
										<p className='text-red-500 text-sm'>
											{errors.address.message}
										</p>
									)}
								</div>
								<div className='space-y-4'>
									<button
										type='submit'
										className='w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all'
									>
										Submit
									</button>
									<button
										type='button'
										onClick={toggleForm}
										className='w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all'
									>
										Close
									</button>
								</div>
							</form>
						</div>
					)}
				</div>

				{/* Students table */}
				<table className='min-w-full bg-white rounded-lg shadow-md'>
					<thead>
						<tr className='bg-gray-200 text-gray-700 text-left'>
							<th className='px-6 py-3 font-semibold'>Name</th>
							<th className='px-6 py-3 font-semibold'>Email</th>
							<th className='px-6 py-3 font-semibold text-center'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{studentData.map((student, index) => (
							<tr
								key={student.student_id}
								className={`${
									index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
								} hover:bg-gray-100`}
							>
								<td className='px-6 py-4 text-gray-800'>
									{student.name}
								</td>
								<td className='px-6 py-4 text-gray-600'>
									{student.email}
								</td>
								<td className='px-6 py-4 text-center space-y-2'>
									<button
										onClick={() =>
											handleFullDetails(student)
										}
										className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all mx-1'
									>
										Full Details
									</button>
									<button
										onClick={() => handleUpdate(student)}
										className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all mx-1'
									>
										Update
									</button>
									<button
										onClick={() =>
											handleDelete(student.student_id)
										}
										className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all mx-1'
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Student Details Modal */}
				{selectedStudent && (
					<div
						id='modal-overlay'
						onClick={handleOutsideClick}
						className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
					>
						<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
							<h2 className='text-xl font-bold mb-4'>
								Student Details
							</h2>
							{[
								'student_id',
								'name',
								'email',
								'phone',
								'batch_no',
								'address',
							].map((key) => (
								<p key={key}>
									<strong>
										{key.replace('_', ' ').toUpperCase()}:{' '}
									</strong>
									{selectedStudent[key]}
								</p>
							))}
							<button
								onClick={closeModal}
								className='mt-4 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all'
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default StudentInfo;
