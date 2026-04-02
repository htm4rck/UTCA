import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getCarreras() { return this.http.get<any[]>(`${API}/carreras`); }
  getCarrera(id: number) { return this.http.get<any>(`${API}/carreras/${id}`); }
  getCursos(cicloId?: number) { return this.http.get<any[]>(`${API}/cursos`, { params: cicloId ? { cicloId } : {} }); }
  getCurso(id: number) { return this.http.get<any>(`${API}/cursos/${id}`); }
  getSemanas(cursoId: number) { return this.http.get<any[]>(`${API}/semanas`, { params: { cursoId } }); }
  getSemana(id: number) { return this.http.get<any>(`${API}/semanas/${id}`); }
  getNotas(semanaId: number) { return this.http.get<any[]>(`${API}/notas`, { params: { semanaId } }); }
  createNota(semanaId: number, data: any) { return this.http.post<any>(`${API}/notas?semanaId=${semanaId}`, data); }
  updateNota(id: number, data: any) { return this.http.put<any>(`${API}/notas/${id}`, data); }
  deleteNota(id: number) { return this.http.delete(`${API}/notas/${id}`); }
  getEjercicios(semanaId: number) { return this.http.get<any[]>(`${API}/ejercicios`, { params: { semanaId } }); }
  createEjercicio(semanaId: number, data: any) { return this.http.post<any>(`${API}/ejercicios?semanaId=${semanaId}`, data); }
  updateEjercicio(id: number, data: any) { return this.http.put<any>(`${API}/ejercicios/${id}`, data); }
  deleteEjercicio(id: number) { return this.http.delete(`${API}/ejercicios/${id}`); }
  getSilaboPdf(cursoId: number) { return `${API}/reports/silabo/${cursoId}`; }
  getMallaPdf() { return `${API}/reports/malla`; }
}
