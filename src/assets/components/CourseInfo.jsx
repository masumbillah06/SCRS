import { useState } from 'react';
import { useForm } from 'react-hook-form';

function CourseInfo({ courseData, getCourses }) {
	const [selectedCourse, setSelectedCourse] = useState(null);
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
			? `http://localhost:3000/courses/${data.course_id}`
			: 'http://localhost:3000/courses';
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
				throw new Error('Failed to save course data');
			}

			const result = await response.json();
			alert(
				isEditMode
					? 'Course updated successfully!'
					: 'Course created successfully!'
			);
			reset();
			setIsFormVisible(false);
			setIsEditMode(false);
			setSelectedCourse(null);
			console.log(result);
			getCourses();
		} catch (err) {
			console.error('Error:', err.message);
			alert('Error saving course data. Please try again.');
		}
	};

	// Right now no need for update

	// const handleUpdate = (course) => {
	// 	setIsEditMode(true); // Switch form to edit mode
	// 	setIsFormVisible(true); // Open the form
	// 	reset(course); // Pre-fill the form with the course's current data
	// };

	const handleCancel = () => {
		if (window.confirm('Are you sure you want to delete?')) {
			alert('deleting....');
			// Add delete logic here
		} else {
			alert('Action canceled.');
		}
	};

	const handleDelete = async (id) => {
		handleCancel();
		try {
			const res = await fetch(`http://localhost:3000/courses/${id}`, {
				method: 'DELETE',
			});
			const data = await res.json();

			if (data.error) {
				alert(data.error);
				getCourses();
			} else {
				alert(`Deleted course with ID: ${id}`);
				getCourses();
			}
		} catch (err) {
			console.error('Error:', err.message);
			alert(`Deleted course with ID: ${id}`);
			getCourses();
		}
	};

	const handleFullDetails = (course) => {
		setSelectedCourse(course); // Set the course for viewing full details
	};

	const closeModal = () => {
		setSelectedCourse(null); // Clear the selected course to close the modal
	};

	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-overlay') {
			closeModal(); // Close the modal if clicked outside the modal content
		}
	};

	return (
		<div>
			<h1 className='text-3xl font-semibold text-center mb-5'>
				All Courses
			</h1>
			<div className='p-8 bg-gray-100 min-h-screen'>
				<div className='mx-auto my-3'>
					{/* Toggle form button */}
					<button
						onClick={toggleForm}
						className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all'
					>
						{isFormVisible ? 'Close Form' : 'Create Course'}
					</button>

					{/* Course creation form */}
					{isFormVisible && (
						<div className='bg-white p-6 rounded-lg shadow-md mt-4'>
							<h1 className='text-2xl font-bold text-center mb-6'>
								{isEditMode ? 'Update Course' : 'Create Course'}
							</h1>
							<form onSubmit={handleSubmit(onSubmit)}>
								{[
									{
										name: 'course_id',
										label: 'Course ID',
										type: 'text',
									},
									{
										name: 'course_name',
										label: 'Course Name',
										type: 'text',
									},
									{
										name: 'course_description',
										label: 'Course Description',
										type: 'text',
									},
									{
										name: 'credits',
										label: 'Credits',
										type: 'number',
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

				{/* Courses table */}
				<table className='min-w-full bg-white rounded-lg shadow-md'>
					<thead>
						<tr className='bg-gray-200 text-gray-700 text-left'>
							<th className='px-6 py-3 font-semibold'>
								Course Name
							</th>
							<th className='px-6 py-3 font-semibold'>
								Course ID
							</th>
							<th className='px-6 py-3 font-semibold text-center'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{courseData.map((course, index) => (
							<tr
								key={course.course_id}
								className={`${
									index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
								} hover:bg-gray-100`}
							>
								<td className='px-6 py-4 text-gray-800'>
									{course.course_name}
								</td>
								<td className='px-6 py-4 text-gray-600'>
									{course.course_id}
								</td>
								<td className='px-6 py-4 text-center space-y-2'>
									<button
										onClick={() =>
											handleFullDetails(course)
										}
										className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all'
									>
										Full Details
									</button>

									{/* Right Now No need for update */}
									{/* <button
										onClick={() => handleUpdate(course)}
										className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all'
									>
										Update
									</button> */}
									<button
										onClick={() =>
											handleDelete(course.course_id)
										}
										className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all'
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Course Details Modal */}
				{selectedCourse && (
					<div
						id='modal-overlay'
						onClick={handleOutsideClick}
						className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
					>
						<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
							<h2 className='text-xl font-bold mb-4'>
								Course Details
							</h2>
							{[
								'course_id',
								'course_name',
								'course_description',
								'credits',
							].map((key) => (
								<p key={key}>
									<strong>
										{key.replace('_', ' ').toUpperCase()}:
									</strong>
									{selectedCourse[key]}
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

export default CourseInfo;
