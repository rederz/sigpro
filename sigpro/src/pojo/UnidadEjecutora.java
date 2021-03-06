package pojo;
// Generated Dec 28, 2016 1:25:08 PM by Hibernate Tools 5.2.0.CR1

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * UnidadEjecutora generated by hbm2java
 */
@Entity
@Table(name = "unidad_ejecutora", catalog = "sigpro")
public class UnidadEjecutora implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4923049907482107666L;
	private Integer unidadEjecutora;
	private Entidad entidad;
	private String nombre;
	private Set<Colaborador> colaboradors = new HashSet<Colaborador>(0);
	private Set<Proyecto> proyectos = new HashSet<Proyecto>(0);

	public UnidadEjecutora() {
	}

	public UnidadEjecutora(Entidad entidad, String nombre) {
		this.entidad = entidad;
		this.nombre = nombre;
	}

	public UnidadEjecutora(Entidad entidad, String nombre, Set<Colaborador> colaboradors, Set<Proyecto> proyectos) {
		this.entidad = entidad;
		this.nombre = nombre;
		this.colaboradors = colaboradors;
		this.proyectos = proyectos;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "unidad_ejecutora", unique = true, nullable = false)
	public Integer getUnidadEjecutora() {
		return this.unidadEjecutora;
	}

	public void setUnidadEjecutora(Integer unidadEjecutora) {
		this.unidadEjecutora = unidadEjecutora;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "entidadentidad", nullable = false)
	public Entidad getEntidad() {
		return this.entidad;
	}

	public void setEntidad(Entidad entidad) {
		this.entidad = entidad;
	}

	@Column(name = "nombre", nullable = false, length = 1000)
	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "unidadEjecutora")
	public Set<Colaborador> getColaboradors() {
		return this.colaboradors;
	}

	public void setColaboradors(Set<Colaborador> colaboradors) {
		this.colaboradors = colaboradors;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "unidadEjecutora")
	public Set<Proyecto> getProyectos() {
		return this.proyectos;
	}

	public void setProyectos(Set<Proyecto> proyectos) {
		this.proyectos = proyectos;
	}

}
