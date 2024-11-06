import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black-main text-white py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-center md:text-left mb-4 md:mb-0">
                        &copy; 2024 BergamotaRoutes. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Service</Link>
                        <Link href="/contact" className="hover:underline">Contact Us</Link>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <i className="fab fa-facebook-f"></i> {/* Requiere Font Awesome */}
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <i className="fab fa-twitter"></i> {/* Requiere Font Awesome */}
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white">
                        <i className="fab fa-instagram"></i> {/* Requiere Font Awesome */}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
