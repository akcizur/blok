---
id: 2
title: "Kdy má smysl psát vlastní komponentu"
excerpt: "Ne každá interakce potřebuje další abstrakci. Jak poznat, co patří do design systému, co má zůstat lokální a kde vlastní řešení skutečně přinese hodnotu."
category: "Code"
date: "25. 9. 2026"
readTime: "6 min"
---

# Kdy má smysl psát vlastní komponentu

![Editorialní detail komponenty](https://picsum.photos/seed/blok-component/1200/675?grayscale)

Komponenta je užitečná tehdy, když **snižuje opakování rozhodnutí**. Ne proto, že dokážeme obalit každý `div` do další vrstvy abstrakce.

## Tři dobré důvody

Vlastní komponenta dává smysl, když se něco opakuje, sdílí chování nebo potřebuje jeden konzistentní kontrakt.

Například tlačítko může sjednotit velikost, stav `disabled`, focus ring a ikonografii. U složitějších prvků zase může zapouzdřit celý interakční model.

## Lokální řešení není chyba

Když se prvek objeví jednou a jeho logika je jednoduchá, může být přehlednější nechat ho přímo v konkrétní obrazovce.

> Abstrakce má odstraňovat tření. Pokud přidává nové rozhodování, je příliš brzy.

## Komponenta by měla mít jasný kontrakt

Dobrá komponenta má několik vlastností:

1. očekávané vstupy
2. předvídatelné stavy
3. jednoznačné vizuální chování
4. omezený počet výjimek

Jakmile API začne obsahovat desítky přepínačů, komponenta se může měnit v malý framework uvnitř frameworku.

## Opakování je signál

Nejjednodušší pravidlo: nejdřív věc několikrát použij, potom hledej společný tvar.

Tím vzniká abstrakce z reálného použití, ne z teorie.
