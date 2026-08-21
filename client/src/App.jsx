import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./features/products/ProductsPage";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ProtectedRoute from "./features/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* דף המוצרים מוגן - נגיש רק למי שמחובר (יש טוקן) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
