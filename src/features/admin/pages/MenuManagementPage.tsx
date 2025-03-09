import { useToast } from "@/contexts/ToastContext";
import { Menu, MenuForm } from "@/features/admin/types/Admin";
import { DeleteButton, SaveButton, ToggleButton } from "@/shared/components/common/button/Button";
import Form from "@/shared/components/common/form/Form";
import FormField from "@/shared/components/common/form/FormField";
import Table from "@/shared/components/common/table/Table";
import TableBody from "@/shared/components/common/table/TableBody";
import TableCell from "@/shared/components/common/table/TableCell";
import TableHead from "@/shared/components/common/table/TableHead";
import TableRow from "@/shared/components/common/table/TableRow";
import { useCrudActions } from "@/shared/hooks/useCrudActions";
import { booleanToInteger } from "@/shared/utils/booleanConverter";
import { useMenuStore } from "@/store/MenuStore";
import { useEffect, useState } from "react";

const MenuManagementPage = () => {
    const { menus, getMenu } = useMenuStore();
    const { showToast } = useToast();
    const { handleSave, handleUpdate, handleDelete } = useCrudActions<Menu>({
        tableName: 'menus',
        validate: (menu: Menu) => {
            if (!menu.name) {
                return '메뉴 이름은 필수 입력 항목입니다.';
            }
            return true;
        },
        onSuccess: (type: 'insert' | 'update' | 'delete') => {
            if(type === 'insert') {
                showToast('메뉴가 성공적으로 저장되었습니다.', 'success');
            } else if(type === 'update') {
                showToast('메뉴가 성공적으로 수정되었습니다.', 'success');
            } else if(type === 'delete') {
                showToast('메뉴가 성공적으로 삭제되었습니다.', 'success');
            }
            getMenu();
        },
        onError: (error: string) => {
            showToast(error, 'error');
        }
    });

    const [menuForm, setMenuForm] = useState<MenuForm>({
        name: '',
        displayOrder: 1,
        isActive: booleanToInteger(true),
        route: ''
    });

    useEffect(() => {
        getMenu();
    }, []);

    /***
     * 20250208 
     * 
     * 메뉴 활성화 토글 추가 -> useCrudActions에 추가할지 고민
     * 
     * 
     */

    const handleToggle = (id: number) => {
        console.log(id);
    }

    return (
        <div style ={{display: 'flex', gap: '10px'}}>
            <div className="table-layout" style={{width: '50%', height: 'calc(100vh - 100px)'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>메뉴 이름</TableCell>
                            <TableCell>순서</TableCell>
                            <TableCell>활성 여부</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menus.map((menu) => (
                            <TableRow key={menu.id}>
                                <TableCell>{menu.name}</TableCell>
                                <TableCell>{menu.displayOrder}</TableCell>
                                <TableCell style={{display: 'flex', gap: '10px'}}>
                                    <ToggleButton
                                        isActive={menu.isActive === 1}
                                        onToggle={() => {}}
                                    />
                                    <DeleteButton onClick={() => handleDelete(menu.id)}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="form-layout" style={{width: '50%'}}>
                <Form>
                    <FormField label="메뉴 이름" htmlFor="name" required>
                        <input 
                            type="text" 
                            name="name" 
                            value={menuForm.name} 
                            onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} />   
                    </FormField>
                    <FormField label="순서" htmlFor="displayOrder" required>
                        <input 
                            type="number" 
                            name="displayOrder" 
                            value={menuForm.displayOrder} 
                            onChange={(e) => setMenuForm({...menuForm, displayOrder: Number(e.target.value)})} />
                    </FormField>
                    <SaveButton onClick={() => handleSave(menuForm)}/>
                </Form>
            </div>
        </div>
    );
};

export default MenuManagementPage;