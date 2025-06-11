import About from "@/components/landing/about";
import Login from "@/components/landing/login";



const Index = () => {

  return (
    <div className="min-h-screen gradient-accent flex">
      <About />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Login/>
      </div>
    </div>
  );
};

export default Index;
