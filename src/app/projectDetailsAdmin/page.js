import ProjectDetailsAdmin from './ProjectDetailsAdmin';

export const metadata = {
  title: 'Detalles del Proyecto - Admin',
  description: 'Página de detalles del proyecto para el administrador',
};

export default function ProjectDetailsAdminPage({ searchParams }) {
  const { projectId } = searchParams;

  return <ProjectDetailsAdmin projectId={projectId} />;
}
