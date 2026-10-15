import {seedRecipes} from './data.js';
const KEY='smak.recipes.v1';
export function validateRecipe(r){return r&&typeof r.id==='string'&&typeof r.title==='string'&&r.title.trim().length>0&&r.title.length<=150&&typeof r.category==='string'&&typeof r.description==='string'&&typeof r.notes==='string'&&Number.isFinite(r.time)&&r.time>0&&r.time<=1440&&Number.isInteger(r.servings)&&r.servings>0&&r.servings<=100&&typeof r.image==='string'&&(r.image===''||/^assets\/[a-z]+\.jpg$/.test(r.image)||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(r.image))&&Array.isArray(r.ingredients)&&r.ingredients.length>0&&r.ingredients.every(i=>typeof i.name==='string'&&i.name.trim()&&Number.isFinite(i.amount)&&i.amount>=0&&typeof i.unit==='string')&&Array.isArray(r.steps)&&r.steps.length>0&&r.steps.every(s=>typeof s==='string'&&s.trim());}
export const recipeRepository={
 list(){const value=localStorage.getItem(KEY);if(value===null){const initial=structuredClone(seedRecipes);this.save(initial);return initial;}let records;try{records=JSON.parse(value);}catch{throw new Error('Не вдалося прочитати збережені рецепти. Відновіть їх із резервної копії.');}if(!Array.isArray(records)||!records.every(validateRecipe))throw new Error('Збережені дані пошкоджені. Відновіть їх із резервної копії.');return records;},
 save(records){try{localStorage.setItem(KEY,JSON.stringify(records));}catch{throw new Error('Не вдалося зберегти. Сховище браузера заповнене або недоступне. Спробуйте менше фото та зробіть резервну копію.');}},
 get(id){return this.list().find(r=>r.id===id);},
 upsert(recipe){if(!validateRecipe(recipe))throw new Error('Перевірте назву, інгредієнти та кроки рецепта.');const records=this.list();const i=records.findIndex(r=>r.id===recipe.id);if(i<0)records.unshift(recipe);else records[i]=recipe;this.save(records);},
 remove(id){this.save(this.list().filter(r=>r.id!==id));},
 toggleFavorite(id){const records=this.list();const r=records.find(r=>r.id===id);if(r)r.favorite=!r.favorite;this.save(records);return r?.favorite;},
 import(records){if(!Array.isArray(records)||!records.every(validateRecipe))throw new Error('Файл не містить коректної резервної копії рецептів.');const map=new Map(this.list().map(r=>[r.id,r]));for(const r of records)map.set(r.id,r);this.save([...map.values()]);}
};
