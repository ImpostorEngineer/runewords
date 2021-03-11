## Diablo 2 Runewords

This is a simple website that will serve an API to fetch runewords.  
We play two mods: Path of Diablo and Project Diablo 2. 

### API
- Path of Diablo Runewords: ```/api/podrw/:name```  
- Project Diablo 2 Runewords: ```/api/pd2rw/:name```  
- Original D2 runewords can be fetched at: ```/api/d2rw/:name```

### You can also search for a Rune or an Item, will fetch Runewords that could be used with that rune/item:
- ```/api/runes/:rune```  
- ```/api/items/:item```
