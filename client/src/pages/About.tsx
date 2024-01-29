import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">About MERNState</h1>
      <p className="mb-4 text-slate-700">
        Hello, my name is Dmytro, and i learn frontend direction with using React.js . Stack this
        project : Taiwind CSS, redux@toolkit, TypeScript, swiper, google-firebase, react-router,
        axios, express, mongoose.
        <br />
        For this project i improved my skills in working with Axios and TypeScript. I learned how to
        style components using Tailwind CSS and improved it. Also in tsis project i create Backend
        api, learned models, controllers and routing. In backend im used libraries mongoose, bcrypt.
        This project i find on youtube channel
        <a
          className="text-blue-800 font-semibold hover:underline"
          href="https://www.youtube.com/@reactproject">
          "React & Next js Projects with Sahand"
        </a>
        , learn his work and try to reproduce it.
        <span className="text-blue-800 font-semibold">Thanks, Sahand.</span>{' '}
      </p>
      <p>
        If you find bugs or unknown errors or you want coop with me, contact me gmail :
        dimacelujkin@gmail.com
      </p>
    </div>
  );
};

export default About;
