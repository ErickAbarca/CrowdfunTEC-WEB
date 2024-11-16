import { collection, getDocs } from 'firebase/firestore';
import db from '../db';

export async function GET() {
  try {
    // Obtener las colecciones necesarias desde Firebase
    const [usuariosSnap, proyectosSnap, donacionesSnap, mentoriasSnap] = await Promise.all([
      getDocs(collection(db, 'usuarios')),
      getDocs(collection(db, 'proyectos')),
      getDocs(collection(db, 'donaciones')),
      getDocs(collection(db, 'mentorias')),
    ]);

    // Transformar los datos obtenidos
    const usuarios = usuariosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const proyectos = proyectosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const donaciones = donacionesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const mentorias = mentoriasSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Estadísticas de usuarios
    const totalUsuarios = usuarios.length;
    const tipoUser = usuarios.filter((u) => u.rol === 'user').length;
    const tipoAdmin = usuarios.filter((u) => u.rol === 'admin').length;
    const tipoMentor = usuarios.filter((u) => u.rol === 'mentor').length;

    // Estadísticas de proyectos
    const totalProyectos = proyectos.length;

    // Dinero total donado
    const totalDineroDonado = donaciones.reduce((sum, d) => sum + d.monto, 0);

    // Dinero donado por proyecto
    const donacionesPorProyecto = proyectos.map((proyecto) => {
      const montoDonado = donaciones
        .filter((d) => d.id_proyecto === proyecto.id)
        .reduce((sum, d) => sum + d.monto, 0);
      return {
        id: proyecto.id,
        nombre: proyecto.nombre,
        montoDonado,
        dinero_objetivo: proyecto.dinero_objetivo,
      };
    });

    // Dinero donado por usuario
    const donacionesPorUsuario = usuarios.map((usuario) => {
      const donacionesUsuario = donaciones.filter((d) => d.id_donante === usuario.id);
      const proyectosConDonaciones = donacionesUsuario.reduce((acc, d) => {
        if (!acc[d.id_proyecto]) {
          acc[d.id_proyecto] = 0;
        }
        acc[d.id_proyecto] += d.monto;
        return acc;
      }, {});
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        donaciones: Object.keys(proyectosConDonaciones).map((proyectoId) => ({
          proyecto: proyectos.find((p) => p.id === proyectoId)?.nombre || 'Proyecto desconocido',
          monto: proyectosConDonaciones[proyectoId],
        })),
      };
    });

    // Estadísticas de mentorías
    const totalMentorias = mentorias.length;
    const mentoriasPorUsuario = usuarios.map((usuario) => {
      const mentoriasUsuario = mentorias.filter((m) => m.mentor_id === usuario.id);
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        mentorías: mentoriasUsuario.map((m) => m.descripcion),
      };
    });

    // Respuesta del endpoint
    return new Response(
      JSON.stringify({
        totalUsuarios,
        tipoUser,
        tipoAdmin,
        tipoMentor,
        totalProyectos,
        totalDineroDonado,
        donacionesPorProyecto,
        donacionesPorUsuario,
        totalMentorias,
        mentoriasPorUsuario,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al obtener estadísticas', error: error.message }),
      { status: 500 }
    );
  }
}
