'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page after the page is mounted
    router.push('/login');
  }, [router]); // Only run once when the component mounts

  return <div>Loading...</div>; // Optionally display loading state
};

export default Home;
