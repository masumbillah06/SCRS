import './App.css';
import CourseInfo from './assets/components/CourseInfo';
import RegistrationInfo from './assets/components/RegistrationInfo';
import StudentInfo from './assets/components/StudentInfo';

import { useEffect, useState } from 'react';

function App() {
	const [studentInfo, setStudentInfo] = useState(true);
	const [courseInfo, setCourseInfo] = useState(false);
	const [registrationInfo, setRegistrationInfo] = useState(false);

	const [studentData, setStudentData] = useState([]);
	const [courseData, setCourseData] = useState([]);

	const handleClickBtn = (e) => {
		//Show Student
		if (e.target.name == 'student') {
			setStudentInfo(true);
			setCourseInfo(false);
			setRegistrationInfo(false);
			getStudents();
		}

		//Show Course
		if (e.target.name == 'course') {
			setStudentInfo(false);
			setCourseInfo(true);
			setRegistrationInfo(false);
			getCourses();
		}

		//Show Registration
		if (e.target.name == 'registration') {
			setStudentInfo(false);
			setCourseInfo(false);
			setRegistrationInfo(true);
		}
	};

	const getStudents = async () => {
		try {
			const response = await fetch('http://localhost:3000/students');
			const studentData = await response.json();

			setStudentData(studentData);
			console.log('student called');
		} catch (err) {
			console.log(err.message);
		}
	};

	const getCourses = async () => {
		try {
			const response = await fetch('http://localhost:3000/courses');
			const courseData = await response.json();

			setCourseData(courseData);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		getStudents();
	}, []);

	return (
		<>
			<div className='p-3'>
				<h1 className='text-3xl font-bold underline uppercase text-center my-5'>
					Student Course Registration System
				</h1>

				<div className='flex mt-16'>
					<div className='w-1/5 h-auto bg-slate-600 mx-20 p-10 flex flex-col gap-10'>
						<button
							onClick={(e) => handleClickBtn(e)}
							name='student'
							className='rounded-md bg-lime-300 py-10 px-10 font-bold uppercase'
						>
							Students
						</button>

						<button
							onClick={(e) => handleClickBtn(e)}
							name='course'
							className=' rounded-md bg-lime-300 py-10 px-10
							font-bold uppercase'
						>
							Course
						</button>

						<button
							onClick={(e) => handleClickBtn(e)}
							name='registration'
							className='rounded-md bg-lime-300 py-10 px-10 font-bold uppercase'
						>
							Registration
						</button>
					</div>

					<div className='w-3/5 h-auto bg-slate-600 p-10 font-bold uppercase'>
						{studentInfo && (
							<StudentInfo
								studentData={studentData}
								getStudents={getStudents}
							/>
						)}
						{courseInfo && (
							<CourseInfo
								courseData={courseData}
								getCourses={getCourses}
							/>
						)}
						{registrationInfo && <RegistrationInfo />}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
