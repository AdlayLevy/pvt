"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FilterSection from "../../components/filterSection";
import TableSection from "../../components/tableSection";
import DropdownUserMenu from "../../components/dropdownUserMenu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  ArrowLeftRight,
  ChevronRight,
  Clipboard,
  ClipboardCopy,
  Flag,
  Settings,
  ShieldCheck,
  TableProperties,
  User,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DailyReport from "../../components/screens/dailyReport";
import Transactions from "../../components/screens/transactions";
import AccountReport from "../../components/screens/accountReport";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Main() {
  const menu = [
    {
      title: "Tableros",
      submenu: [],
      icon: <TableProperties />,
    },
    {
      title: "Transacciones",
      submenu: [],
      icon: <ArrowLeftRight />,
    },
    // {
    //   title: "On-Boarding",
    //   submenu: ["Comercios", "Terminales"],
    //   icon: <ClipboardCopy />,
    // },
    // {
    //   title: "Operaciones",
    //   submenu: [
    //     "Movimientos",
    //     "Contracargos",
    //     "Conciliaciones",
    //     "Solicitudes de Transacciones",
    //   ],
    //   icon: <Clipboard />,
    // },
    {
      title: "Reportes",
      submenu: ["Cortes Diarios", "Estado de Cuenta"],
      icon: <Clipboard />,
    },
    // {
    //   title: "Administración",
    //   submenu: ["Comisiones"],
    //   icon: <Settings />,
    // },
    // {
    //   title: "Reglas de Autorización",
    //   submenu: ["Por Comercio"],
    //   icon: <ShieldCheck />,
    // },
    {
      title: "Usuarios",
      submenu: [
        "Admin de Cadenas",
        "Admin de Comercios",
        "Usuarios de Comercios",
      ],
      icon: <User />,
    },
  ];

  const submenu = {
    transacciones: "Transacciones",
    comercios: "Comercios",
    terminales: "Terminales",
    movimientos: "Movimientos",
    contracargos: "Contracargos",
    conciliaciones: "Conciliaciones",
    solicitudes: "Solicitudes de Transacciones",
    anual: "Anual",
    mensual: "Mensual",
    diario: "Cortes Diarios",
    ratios: "Ratios de Contracargos",
    comisiones: "Comisiones",
    porcomercio: "Por Comercio",
    adminCadenas: "Admin de Cadenas",
    adminComercios: "Admin de Comercios",
    usuariosComer: "Usuarios de Comercios",
    tableros: "Tableros",
    estadoCuenta: "Estado de Cuenta",
  };

  const [activeTab, setActiveTab] = useState(submenu.transacciones);

  return (
    <div>
      <div className="w-full">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex justify-center p-6 space-x-2 items-center">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
                <div>Company Name</div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Payment Web</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menu.map((item) => (
                      <div>
                        {item.submenu.length > 0 ? (
                          <Collapsible key={item.title} asChild>
                            <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="flex items-center py-7">
                                  <div className="flex gap-2 items-center">
                                    {item.icon}
                                    {item.title}
                                  </div>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {item.submenu.map((submenu) => (
                                    <SidebarMenuSubItem key={submenu}>
                                      <SidebarMenuButton
                                        asChild
                                        onClick={() => setActiveTab(submenu)}
                                      >
                                        <div className="flex gap-2 items-center">
                                          {submenu}
                                        </div>
                                      </SidebarMenuButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuItem>
                          </Collapsible>
                        ) : (
                          <SidebarMenuButton
                            className="py-7"
                            onClick={() => setActiveTab(item.title)}
                          >
                            <div className="flex gap-2 items-center">
                              {item.icon}
                              {item.title}
                            </div>
                          </SidebarMenuButton>
                        )}
                      </div>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b p-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex lg:flex-1 space-x-2 items-center">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
                <div>Company Name</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch id="language" />
                  <Label htmlFor="language">ENG /ESP</Label>
                </div>
                <DropdownUserMenu />
              </div>
            </header>
            <div>
              {activeTab === submenu.tableros && <Tableros />}
              {activeTab === submenu.transacciones && <Transactions />}
              {activeTab === submenu.diario && <DailyReport />}
              {activeTab === submenu.estadoCuenta && <AccountReport />}
              {activeTab === submenu.adminCadenas && <AdminCadenas />}
              {activeTab === submenu.adminComercios && <AdminComercios />}
              {activeTab === submenu.usuariosComer && <UsuariosComercios />}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}

function SectionTitle(props: { title: string }) {
  return (
    <div className="pb-6 text-2xl font-bold text-indigo-800">{props.title}</div>
  );
}

function Tableros() {
  return (
    <div className="w-full p-6">
      <SectionTitle title="Tableros" />
      {/* // TODO: add graphics
       */}
    </div>
  );
}

function AdminCadenas() {
  return (
    <div className="w-full p-6">
      <SectionTitle title="Administrador de Cadenas" />
      <TableSection hasAddButton buttonLabel="Anadir item" />
    </div>
  );
}
function AdminComercios() {
  return (
    <div className="w-full p-6">
      <SectionTitle title="Administrador de Comercios" />
      <TableSection hasAddButton buttonLabel="Añadir item" />
    </div>
  );
}
function UsuariosComercios() {
  return (
    <div className="w-full p-6">
      <SectionTitle title="Usuarios de Comercios" />
      <TableSection hasAddButton buttonLabel="Añadir usuario" />
    </div>
  );
}
