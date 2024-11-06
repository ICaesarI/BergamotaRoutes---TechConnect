<<<<<<< HEAD
import Image from "next/image";

import maps from "@techconnect /src/img/maps.jpeg";

export default function Home(){
    return(
        <div className="flex justify-center items-center h-screen relative m-5">
            <Image src={maps} alt="Mapa maps" className="w-500 h-500 m-auto border-4 border-black" />
            <div className="absolute inset-0 flex items-center justify-start m-20">
                <div className="flex flex-col items-start border-4 border-black m-20">
                    <h1 className="font-bold text-xl font-bold bg-white bg-opacity-70 p-4 max-w-xs"> Convert long links into short and accessible links instantly.</h1>
                    <p className="text-white text-lg font-semibold bg-black bg-opacity-50 p-2 max-w-xs">Simplify the logistics of your deliveries with our route shortening solutions. At
                    BergamotRoutes, we make your routes more direct and profitable, guaranteeing
                    faster and more precise delivery. Optimize your routes and improve your parcel
                    service today!
                    </p>
                </div>
            </div>
            
=======
"use client";
import Image from "next/image";

import React, {useEffect, useState} from 'react';
import {BsChevronCompactLeft,BsChevronCompactRight} from 'react-icons/bs'
import {RxDotFilled} from 'react-icons/rx'
import AOS from "aos";
import "aos/dist/aos.css"

import maps from "@techconnect /src/img/maps.jpeg";
import paisaje from "@techconnect /src/img/paisaje.jpg";

import { Tuerca } from "@techconnect /src/components/HowWorks";
import { Diamond } from "@techconnect /src/components/quality";
import { Money } from "@techconnect /src/components/reliability";

export default function Home(){
    const slides = [
        {
            url: 'https://fastly.picsum.photos/id/1018/1000/600.jpg?hmac=8y6PgnvgTLEEW-118lVn6V6zPUVSN9JSi27GSpmGpdQ'
        },
        {
            url: 'https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            url: 'https://images.unsplash.com/photo-1504194104404-433180773017?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            url: 'https://plus.unsplash.com/premium_photo-1673002094117-be8021ca0add?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZyZWV8ZW58MHx8MHx8fDA%3D'
        },
        {
            url: 'https://plus.unsplash.com/premium_photo-1661928975475-57502a6e34a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGZyZWV8ZW58MHx8MHx8fDA%3D'
        },
    ];

    const[currentIndex, setCurrentIndex] = useState(0)

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }
    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    }

    useEffect(() =>{
        AOS.init({duration:1200})
    })

    return(
        <div>
            <div className="max-w-[100%] h-[500px] w-full m-auto py-0 px-0 relative group">
                <div style={{ backgroundImage: `url(${slides[currentIndex].url})`}} className="w-full h-full rounded-2xl bg-center bg-cover duration-500">

                </div>
                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <BsChevronCompactLeft onClick={prevSlide} size={30}/>
                </div>
                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <BsChevronCompactRight onClick={nextSlide} size={30}/>
                </div>
                <div className="flex top-4 justify-center py-2">
                    {slides.map((slide, slideIndex) => (
                        <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className="text-2xl cursor-pointer">
                            <RxDotFilled />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-start m-20">
                    <div className="flex flex-col items-start m-10 w-1/2 bg-white bg-opacity-50 border-2 border-black">
                        <h1 className="font-bold p-5 w-full text-3xl text-center rounded-t-xl"> Convert long links into short and accessible links instantly.</h1>
                        <p className="font-semibold p-2 text-justify rounded-b-xl">Simplify the logistics of your deliveries with our route shortening solutions. At
                        BergamotRoutes, we make your routes more direct and profitable, guaranteeing
                        faster and more precise delivery. Optimize your routes and improve your parcel
                        service today!
                        </p>
                    </div>
                </div>
            </div>
            <hr className="border-t-2 border-gray-300 w-4/5 my-10 mx-auto"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-20">
                <div className="bg-black-main opacity-70 p-6 text-white rounded-t-full place-items-center">
                    <div className="m-4">
                        <Tuerca />                   
                    </div>
                    <h1 className="font-bold text-center text-xl">
                        How does this page work?
                    </h1>     
                    <p className="text-justify p-3">This application gives the optimized route to a driver to be able to deliver its packages in a more optimal and faster way both for it and for the users waiting for its packages.</p>                                      
                </div>
                <div className="bg-black-main opacity-70 p-4 text-white rounded-t-full place-items-center">                    
                <div className="m-4">
                        <Diamond />                   
                    </div>
                    <h1 className="font-bold text-center text-xl">
                        Quality first
                    </h1>                
                    <p className="text-justify p-3">We are committed to quality, so we are sure to provide good quality in all our work so that you enjoy the page.</p>
                </div>
                <div className="bg-black-main opacity-70 p-4 text-white rounded-t-full place-items-center">                    
                    <div className="m-4">
                        <Money />                   
                    </div>
                    <h1 className="font-bold text-center text-xl">
                        Reliability
                    </h1>
                    <p className="text-justify p-3">We believe that the profitability of this page is 100%, since a page like this is often necessary, which gives us the possibility of very optimal package delivery.</p>
                </div>            
            </div>
            <hr className="border-t-2 border-gray-300 w-4/5 my-10 mx-auto"/>
            <div className="lg:grid-cols-2 m-10 grid place-items-center">
                <div className="w-[80%] m-7">
                    <h2 className="text-4xl my-5">Route Organization</h2>
                    <p className="text-lg text-justify">Our application is based on obtaining the shortest route for a driver who wants to deliver packages to several addresses in a city, starting from the starting point, and continuing with the location with the fewest kilometers from the last point.</p>
                </div>
                <div className="w-[80%] flex">
                    <Image src={paisaje} alt="Paisaje" className="object-cover w-full h-full" data-aos="fade-up"/>
                </div>
                <div className="w-[80%] m-7">
                    <Image src={maps} alt="Mapa maps" className="w-full h-full m-auto" data-aos="fade-up"/>
                </div>
                <div className="w-[80%]">
                    <h2 className="text-4xl my-5">Check the route</h2>
                    <p className="text-lg text-justify">The customer will be able to see when the driver is close to their house and is about to deliver their package, but not in real time, they will be at random or timed intervals.</p>
                </div>
            </div>
>>>>>>> origin
        </div>
    )
}