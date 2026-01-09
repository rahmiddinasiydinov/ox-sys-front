"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Pagination } from "@/components/Table";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ArrowLeft, Package, Loader2, RefreshCw, AlertCircle, Barcode, Tag } from "lucide-react";

interface ProductStock {
    count: number;
    sellPrice?: {
        UZS?: number;
        USD?: number;
        first?: string;
    };
    location?: number;
}

interface ProductProperty {
    name: string;
    value: string;
}

interface ProductImage {
    id: number;
    urls: {
        "100x_"?: string;
        "150x_"?: string;
        "300x_"?: string;
        original?: string;
    };
}

interface Product {
    id: number;
    name: string;
    productName?: string;
    sku: string;
    barcode?: string;
    supplier?: string;
    unit?: string;
    properties?: ProductProperty[];
    productProperties?: ProductProperty[];
    stocks?: ProductStock[];
    images?: ProductImage[];
}

function formatPrice(price?: number, currency: string = "UZS"): string {
    if (!price) return "—";
    return new Intl.NumberFormat("uz-UZ", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price) + ` ${currency}`;
}

function getTotalStock(stocks?: ProductStock[]): number {
    if (!stocks || stocks.length === 0) return 0;
    return stocks.reduce((sum, stock) => sum + (stock.count || 0), 0);
}

function getPrice(stocks?: ProductStock[]): { uzs?: number; usd?: number } | null {
    if (!stocks || stocks.length === 0) return null;
    const firstStock = stocks[0];
    return {
        uzs: firstStock.sellPrice?.UZS,
        usd: firstStock.sellPrice?.USD,
    };
}

function getImageUrl(images?: ProductImage[]): string | null {
    if (!images || images.length === 0) return null;
    const img = images[0];
    return img.urls?.["150x_"] || img.urls?.["100x_"] || img.urls?.["300x_"] || img.urls?.original || null;
}

function getProperty(name: string, properties?: ProductProperty[]): string | null {
    if (!properties) return null;
    const prop = properties.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    return prop?.value || null;
}

function ProductCard({ product }: { product: Product }) {
    const imageUrl = getImageUrl(product.images);
    const price = getPrice(product.stocks);
    const totalStock = getTotalStock(product.stocks);
    const size = getProperty("размер", product.properties) || getProperty("size", product.properties);
    const color = getProperty("цвет", product.properties) || getProperty("color", product.properties);

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                        </div>
                    )}
                </div>

                <div className="flex-1 p-3 sm:p-4 min-w-0">
                    <div className="mb-2">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {product.productName || product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                {product.sku}
                            </span>
                            {product.barcode && (
                                <span className="flex items-center gap-1">
                                    <Barcode className="w-3 h-3" />
                                    {product.barcode}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {size && (
                            <Badge variant="default" className="text-xs">
                                {size}
                            </Badge>
                        )}
                        {color && (
                            <Badge variant="default" className="text-xs">
                                {color}
                            </Badge>
                        )}
                        {product.supplier && (
                            <Badge variant="default" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.supplier}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            {price?.uzs && (
                                <p className="font-semibold text-gray-900">
                                    {formatPrice(price.uzs, "UZS")}
                                </p>
                            )}
                            {price?.usd && (
                                <p className="text-xs text-gray-500">
                                    ${price.usd.toFixed(2)} USD
                                </p>
                            )}
                        </div>
                        <Badge variant={totalStock > 0 ? (totalStock < 5 ? "warning" : "success") : "error"}>
                            {totalStock} {product.unit || "pcs"}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!authLoading && user?.companyId) {
            fetchProducts();
        }
    }, [authLoading, user?.companyId, page]);

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.getProducts(page, pageSize);
            const productList = Array.isArray(data) ? data : (data.data || data.items || []);
            setProducts(productList);
            setHasMore(productList.length === pageSize);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user?.companyId) {
        return (
            <main className="min-h-screen pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Card className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No Company Attached
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You need to register a company to view products.
                        </p>
                        <Link href="/register">
                            <Button>Register Company</Button>
                        </Link>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                                <p className="text-sm text-gray-500">
                                    Products from your OX System
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={fetchProducts}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {loading ? (
                    <Card className="py-12">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    </Card>
                ) : products.length === 0 ? (
                    <Card className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No products found in your OX System</p>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <Card className="mt-6 p-0">
                            <Pagination
                                currentPage={page}
                                hasMore={hasMore}
                                onPageChange={setPage}
                            />
                        </Card>
                    </>
                )}
            </div>
        </main>
    );
}
