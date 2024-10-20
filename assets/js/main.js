const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const searchPokemon = document.getElementById("search-pokemon");
const searchButton = document.getElementById("search-button");

const maxRecords = 151;
const limit = 12;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function searchPokemonByName() {
  const name = searchPokemon.value.trim();

  if (name) {
    pokeApi.searchPokemonByName(name).then((pokemon) => {
      if (pokemon) {
        pokemonList.innerHTML = convertPokemonToLi(pokemon);
        loadMoreButton.style.display = "none";
      } else {
        pokemonList.innerHTML =
          '<li class="not-founded">Pokémon não encontrado! 😢</li>';
        loadMoreButton.style.display = "none";
      }
    });
  } else {
    pokemonList.innerHTML = "";
    loadPokemonItens(offset, limit);
  }
}

searchButton.addEventListener("click", searchPokemonByName);

searchPokemon.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchPokemonByName();
  }
});

document.getElementById("resetSearch").addEventListener("click", () => {
  searchPokemon.value = "";
  pokemonList.innerHTML = "";
  loadPokemonItens(offset, limit);
});
