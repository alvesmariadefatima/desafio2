import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
function Home() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorite, setFavorite] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`https://picsum.photos/v2/list?page=1&limit=10`);
            if (!response.ok) throw new Error('Erro ao buscar fotos.');
            const data = await response.json();
            setPhotos(data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar fotos:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchPhotos();
        const savedFavorite = JSON.parse(localStorage.getItem('favoritePhoto'));
        if (savedFavorite) {
            setFavorite(savedFavorite);
        }
    }, []);

    const handleSearch = () => {
        // Não há necessidade de buscar novamente da API
        if (query.trim()) {
            // O estado "query" já está sendo atualizado no onChange do input,
            // e as fotos são filtradas diretamente no retorno JSX.
        }
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    const toggleFavorite = (photo) => {
        if (favorite && favorite.id === photo.id) {
            setFavorite(null);
            localStorage.removeItem('favoritePhoto');
        } else {
            setFavorite(photo);
            localStorage.setItem('favoritePhoto', JSON.stringify(photo));
        }
    };

    const isFavorite = (photo) => {
        return favorite && favorite.id === photo.id;
    };

    const categories = ['Natureza', 'Arquitetura', 'Retratos'];
    const colors = ['Preto e Branco', 'Colorido'];

    const applyFilters = (photos) => {
        return photos.filter(photo => {
            const matchesCategory = categoryFilter ? photo.author.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
            const matchesColor = colorFilter ? (colorFilter === 'Preto e Branco' ? photo.id % 2 === 0 : photo.id % 2 !== 0) : true;
            return matchesCategory && matchesColor;
        });
    };

    const filteredPhotos = applyFilters(photos).filter(photo => photo.author.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="bg-purple-700 min-h-screen flex flex-col">
            <div className="flex items-center justify-center mt-4">
                <img src="/photo.png" alt="Ilustração de uma foto" className="h-12 w-12 mr-2" />
                <h1 className="text-white">Galeria de Fotos</h1>
            </div>
        
            <h2 className="text-white text-center">Frontend Fusion</h2>

            {error && <p className="text-red-500 text-center">{error}</p>} {/* Exibição do erro */}

            <div className="flex items-center justify-center mt-4">
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border border-gray-300 rounded h-10 w-60 p-2"
                />
                <button 
                    onClick={handleSearch} 
                    className="ml-2 h-10 w-20 bg-blue-500 text-white rounded" 
                    aria-label="Buscar"
                >
                    🔍
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map(photo => (
                        <div key={photo.id} className="photo-item" onClick={() => handlePhotoClick(photo)}>
                            <img src={photo.download_url} alt={photo.author} className="w-full h-48 object-cover rounded cursor-pointer" />
                            <p className="text-center text-white">{photo.author}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-white text-center col-span-2 mt-4">Nenhuma foto encontrada com essa pesquisa 📸</p>
                )}
            </div>

            {/* Modal de detalhes da foto */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-4 rounded max-w-lg w-full">
                        <button onClick={closeModal} className="text-red-500 mb-4">Fechar</button>
                        <img src={selectedPhoto.download_url} alt={selectedPhoto.author} className="w-full h-60 object-cover rounded mb-4" />
                        <p><strong>Autor:</strong> {selectedPhoto.author}</p>
                        <p><strong>Dimensões:</strong> {selectedPhoto.width} x {selectedPhoto.height}</p>
                        <p><strong>ID:</strong> {selectedPhoto.id}</p>
                        <p><a href={selectedPhoto.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver no site</a></p>

                        {/* Botão para adicionar/remover dos favoritos */}
                        <button 
                            onClick={() => toggleFavorite(selectedPhoto)} 
                            className={`mt-4 p-2 rounded ${isFavorite(selectedPhoto) ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        >
                            {isFavorite(selectedPhoto) ? 'Remover dos Favoritos ⭐' : 'Adicionar aos Favoritos ⭐'}
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Home;
